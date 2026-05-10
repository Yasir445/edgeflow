import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDashboardStats, detectAIInsights } from "@/lib/analytics";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { entryTime: "asc" },
    include: {
      screenshots: { select: { id: true, url: true } },
      aiFeedback: { select: { qualityScore: true } },
    },
  });

  const account = await prisma.tradingAccount.findFirst({
    where: { userId, isDefault: true },
  });

  const stats = calculateDashboardStats(trades as any, account?.balance ?? 10000);
  const insights = detectAIInsights(trades as any);

  return <DashboardClient stats={stats} insights={insights} />;
}
