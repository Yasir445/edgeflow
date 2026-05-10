import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const priceId = plan === "PRO" ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_ELITE_PRICE_ID;
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  let sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  let customerId = sub?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.user.email!, name: session.user.name ?? undefined, metadata: { userId: session.user.id } });
    customerId = customer.id;
    await prisma.subscription.update({ where: { userId: session.user.id }, data: { stripeCustomerId: customerId } });
  }

  const checkout = await stripe.checkout.sessions.create({
    customer: customerId, mode: "subscription", payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: { trial_period_days: 14, metadata: { userId: session.user.id } },
  });

  return NextResponse.json({ url: checkout.url });
}
