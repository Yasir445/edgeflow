import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDashboardStats, detectAIInsights } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "all";

  const where: Record<string, unknown> = { userId: session.user.id };
  const now = new Date();
  if (period === "week") { const d = new Date(now); d.setDate(now.getDate() - 7); where.entryTime = { gte: d }; }
  else if (period === "month") { where.entryTime = { gte: new Date(now.getFullYear(), now.getMonth(), 1) }; }
  else if (period === "ytd") { where.entryTime = { gte: new Date(now.getFullYear(), 0, 1) }; }

  const trades = await prisma.trade.findMany({ where, orderBy: { entryTime: "asc" } });
  const account = await prisma.tradingAccount.findFirst({ where: { userId: session.user.id, isDefault: true } });
  const stats = calculateDashboardStats(trades as any, account?.balance ?? 10000);
  const insights = detectAIInsights(trades as any);

  return NextResponse.json({ data: { stats, insights } });
}
