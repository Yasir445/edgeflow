import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TradeSchema = z.object({
  pair: z.string().min(1).max(20),
  direction: z.enum(["LONG","SHORT"]),
  setup: z.string().optional(),
  session: z.enum(["ASIAN","LONDON","NEW_YORK","OVERLAP"]).optional(),
  timeframe: z.string().optional(),
  entryPrice: z.number().positive(),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  exitPrice: z.number().positive().optional(),
  positionSize: z.number().positive().optional(),
  riskPercent: z.number().min(0).max(100).optional(),
  pnl: z.number().optional(),
  result: z.enum(["WIN","LOSS","BREAKEVEN","PARTIAL"]).optional(),
  entryTime: z.string(),
  exitTime: z.string().optional(),
  emotionBefore: z.enum(["CALM","FOCUSED","ANXIOUS","FEARFUL","GREEDY","FOMO","FRUSTRATED","CONFIDENT","NEUTRAL","EXCITED","BORED","TIRED"]).optional(),
  emotionAfter: z.enum(["CALM","FOCUSED","ANXIOUS","FEARFUL","GREEDY","FOMO","FRUSTRATED","CONFIDENT","NEUTRAL","EXCITED","BORED","TIRED"]).optional(),
  emotionNotes: z.string().optional(),
  confidenceLevel: z.number().min(1).max(10).optional(),
  executionRating: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  mistakeChecklist: z.array(z.string()).optional(),
  confluences: z.array(z.string()).optional(),
  accountId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") ?? "20"), 100);

  const where: Record<string, unknown> = { userId: session.user.id };
  const pair = searchParams.get("pair");
  const direction = searchParams.get("direction");
  const result = searchParams.get("result");
  if (pair) where.pair = { contains: pair, mode: "insensitive" };
  if (direction) where.direction = direction;
  if (result) where.result = result;

  const [trades, total] = await Promise.all([
    prisma.trade.findMany({
      where,
      include: { screenshots: { select: { id: true, url: true, type: true } }, tags: { include: { tag: true } }, aiFeedback: true },
      orderBy: { entryTime: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trade.count({ where }),
  ]);

  return NextResponse.json({ data: trades, total, page, pageSize, hasMore: page * pageSize < total });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (sub?.plan === "FREE") {
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const count = await prisma.trade.count({ where: { userId: session.user.id, createdAt: { gte: monthStart } } });
    if (count >= 25) return NextResponse.json({ error: "Free plan limit reached. Upgrade to Pro." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = TradeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  let riskReward: number | undefined;
  if (data.entryPrice && data.stopLoss && data.takeProfit) {
    const risk = Math.abs(data.entryPrice - data.stopLoss);
    const reward = Math.abs(data.takeProfit - data.entryPrice);
    if (risk > 0) riskReward = reward / risk;
  }

  const isRevengeTrade = data.emotionBefore === "FRUSTRATED" || data.emotionBefore === "FEARFUL";
  const isFOMOTrade = data.emotionBefore === "FOMO" || data.emotionBefore === "GREEDY";

  const trade = await prisma.trade.create({
    data: {
      userId: session.user.id, ...data,
      entryTime: new Date(data.entryTime),
      exitTime: data.exitTime ? new Date(data.exitTime) : undefined,
      riskReward,
      isRevengeAtrade: isRevengeTrade,
      isFOMOTrade,
    },
  });
  return NextResponse.json({ data: trade }, { status: 201 });
}
