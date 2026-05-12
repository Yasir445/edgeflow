import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardClient
      stats={{
        totalPnl: 0, totalPnlPercent: 0, winRate: 0, totalTrades: 0,
        avgRR: 0, profitFactor: 0, maxDrawdown: 0, currentStreak: 0,
        psychScore: 100, riskScore: 100, disciplineScore: 100, expectancy: 0,
        bestSetup: "N/A", worstSetup: "N/A",
        equityCurve: [], recentTrades: [], setupStats: [],
        sessionStats: [], emotionStats: [], monthlyPnl: [],
      }}
      insights={[]}
    />
  );
}
