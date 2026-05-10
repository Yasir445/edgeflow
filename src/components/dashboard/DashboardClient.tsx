"use client";
import { DashboardStats, AIInsight } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { EquityChart } from "@/components/dashboard/EquityChart";
import { HeatmapCalendar } from "@/components/dashboard/HeatmapCalendar";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { SetupChart } from "@/components/dashboard/SetupChart";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { TrendingUp, TrendingDown, Target, Brain, Zap, Shield, Award, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { stats: DashboardStats; insights: AIInsight[]; }

export function DashboardClient({ stats, insights }: Props) {
  const streakPositive = stats.currentStreak > 0;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-white/30 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["All","MTD","YTD","Week"].map((p) => (
            <button key={p} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              p === "All" ? "bg-white/8 text-white" : "text-white/30 hover:text-white/60")}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Net P&L" value={`${stats.totalPnl >= 0 ? "+" : ""}$${Math.abs(stats.totalPnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub={`${stats.totalPnlPercent >= 0 ? "+" : ""}${stats.totalPnlPercent.toFixed(2)}% return`}
          color={stats.totalPnl >= 0 ? "#00ff9d" : "#ff4d6d"} icon={stats.totalPnl >= 0 ? TrendingUp : TrendingDown} trend={stats.totalPnlPercent} />
        <StatCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} sub={`${stats.totalTrades} total trades`} color="#00b8ff" icon={Target} />
        <StatCard label="Avg R:R" value={`${stats.avgRR.toFixed(2)}R`} sub={`PF: ${stats.profitFactor.toFixed(2)}`} color="#a78bfa" icon={Award} />
        <StatCard label="Streak" value={`${streakPositive ? "+" : ""}${stats.currentStreak}`}
          sub={streakPositive ? "winning streak 🔥" : "losing streak"}
          color={streakPositive ? "#00ff9d" : "#ff4d6d"} icon={Flame} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 ef-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Equity Curve</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30">Max DD: <span className="text-red-400 font-bold">{stats.maxDrawdown.toFixed(1)}%</span></span>
              <span className={cn("text-sm font-bold", stats.totalPnlPercent >= 0 ? "text-emerald-400" : "text-red-400")}>
                {stats.totalPnlPercent >= 0 ? "+" : ""}{stats.totalPnlPercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <EquityChart data={stats.equityCurve} />
        </div>
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Performance Scores</h3>
          <div className="space-y-4">
            <ScoreRing label="Psychology" value={stats.psychScore} color="#00ff9d" icon={Brain} />
            <ScoreRing label="Risk Mgmt" value={stats.riskScore} color="#00b8ff" icon={Shield} />
            <ScoreRing label="Discipline" value={stats.disciplineScore} color="#a78bfa" icon={Zap} />
          </div>
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Expectancy</span>
              <span className={cn("font-bold", stats.expectancy >= 0 ? "text-emerald-400" : "text-red-400")}>
                {stats.expectancy >= 0 ? "+" : ""}${stats.expectancy.toFixed(0)} / trade
              </span>
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Best Setup</span>
              <span className="text-white font-medium">{stats.bestSetup}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">P&L Calendar</h3>
          <HeatmapCalendar trades={stats.recentTrades} />
        </div>
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Setup Breakdown</h3>
          <SetupChart data={stats.setupStats} />
        </div>
      </div>

      {insights.length > 0 && <AIInsightsPanel insights={insights} />}

      <div className="ef-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Recent Trades</h3>
          <a href="/journal" className="text-xs text-white/30 hover:text-white transition-colors">View all →</a>
        </div>
        <RecentTrades trades={stats.recentTrades} />
      </div>
    </div>
  );
}
