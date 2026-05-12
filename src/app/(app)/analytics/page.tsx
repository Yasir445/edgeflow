import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AnalyticsClient
      stats={{
        totalPnl: 0, totalPnlPercent: 0, winRate: 0, totalTrades: 0,
        avgRR: 0, profitFactor: 0, maxDrawdown: 0, currentStreak: 0,
        psychScore: 100, riskScore: 100, disciplineScore: 100, expectancy: 0,
        bestSetup: "N/A", worstSetup: "N/A",
        equityCurve: [], recentTrades: [], setupStats: [],
        sessionStats: [], emotionStats: [], monthlyPnl: [],
      }}
    />
  );
}
