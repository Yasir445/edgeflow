export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object as Stripe.Checkout.Session;
      if (cs.customer) {
        await prisma.subscription.update({
          where: { stripeCustomerId: cs.customer as string },
          data: {
            stripeSubscriptionId: cs.subscription as string,
            status: "ACTIVE",
          },
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price?.id;
      const plan =
        priceId === process.env.STRIPE_PRO_PRICE_ID
          ? "PRO"
          : priceId === process.env.STRIPE_ELITE_PRICE_ID
          ? "ELITE"
          : "FREE";
      await prisma.subscription.update({
        where: { stripeSubscriptionId: sub.id },
        data: {
          plan: plan as "FREE" | "PRO" | "ELITE",
          status: sub.status.toUpperCase() as "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INACTIVE",
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: sub.id },
        data: { plan: "FREE", status: "CANCELED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
