import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateDashboardStats } from "@/lib/analytics";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: { entryTime: "asc" },
  });

  const account = await prisma.tradingAccount.findFirst({
    where: { userId, isDefault: true },
  });

  const stats = calculateDashboardStats(trades as any, account?.balance ?? 10000);
  return <AnalyticsClient stats={stats} />;
}
