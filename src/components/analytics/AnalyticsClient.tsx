"use client";
import { DashboardStats } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { EquityChart } from "@/components/dashboard/EquityChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from "recharts";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ef-card rounded-xl p-3 text-xs">
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="text-white/40">{p.name}:</span>
          <span className="font-bold text-white">{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function AnalyticsClient({ stats }: { stats: DashboardStats }) {
  const radarData = [
    { subject: "Win Rate", value: stats.winRate },
    { subject: "Avg RR", value: Math.min(stats.avgRR * 25, 100) },
    { subject: "Consistency", value: stats.riskScore },
    { subject: "Psychology", value: stats.psychScore },
    { subject: "Discipline", value: stats.disciplineScore },
    { subject: "Profit Factor", value: Math.min(stats.profitFactor * 20, 100) },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-white/30 text-sm mt-0.5">Deep performance breakdown</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Profit Factor" value={stats.profitFactor.toFixed(2)} color="#00ff9d" />
        <StatCard label="Expectancy" value={`$${stats.expectancy.toFixed(0)}`} sub="per trade" color="#00b8ff" />
        <StatCard label="Max Drawdown" value={`${stats.maxDrawdown.toFixed(1)}%`} color="#ff4d6d" />
        <StatCard label="Total Trades" value={stats.totalTrades.toString()} sub={`${stats.winRate.toFixed(1)}% win rate`} color="#a78bfa" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Equity Curve</h3>
          <EquityChart data={stats.equityCurve} />
        </div>
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <Radar name="Score" dataKey="value" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Win Rate by Session</h3>
          {stats.sessionStats.length === 0 ? <p className="text-white/20 text-sm text-center py-8">No session data yet</p> : (
            <div className="space-y-4">
              {stats.sessionStats.map((s) => (
                <div key={s.session}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white font-medium">{s.session.replace("_"," ")}</span>
                    <div className="flex gap-3 text-white/40">
                      <span>{s.trades} trades</span>
                      <span className={cn("font-bold", s.winRate >= 60 ? "text-emerald-400" : "text-red-400")}>{s.winRate.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.winRate}%`, background: s.winRate >= 60 ? "linear-gradient(90deg,#00ff9d,#00b8ff)" : "#ff4d6d" }} />
                  </div>
                  <div className="text-[10px] text-white/20 mt-1">P&L: {s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Win Rate by Emotion</h3>
          {stats.emotionStats.length === 0 ? <p className="text-white/20 text-sm text-center py-8">Log emotions on trades to see data</p> : (
            <div className="space-y-4">
              {stats.emotionStats.sort((a, b) => b.winRate - a.winRate).map((e) => (
                <div key={e.emotion}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-white font-medium">{e.emotion}</span>
                    <span className={cn("font-bold", e.winRate >= 60 ? "text-emerald-400" : e.winRate >= 45 ? "text-yellow-400" : "text-red-400")}>{e.winRate.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${e.winRate}%`, background: e.winRate >= 60 ? "#00ff9d" : e.winRate >= 45 ? "#fbbf24" : "#ff4d6d" }} />
                  </div>
                  <div className="text-[10px] text-white/20 mt-1">{e.trades} trades · Avg: ${e.avgPnl.toFixed(0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ef-card rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Setup Profitability</h3>
        {stats.setupStats.length === 0 ? <p className="text-white/20 text-sm text-center py-8">Tag trades with setups to see breakdown</p> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                  <th className="text-left pb-3 font-medium">Setup</th>
                  <th className="text-right pb-3 font-medium">Trades</th>
                  <th className="text-right pb-3 font-medium">Win Rate</th>
                  <th className="text-right pb-3 font-medium">Net P&L</th>
                  <th className="text-right pb-3 font-medium">Avg R:R</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {stats.setupStats.map((s) => (
                  <tr key={s.setup} className="hover:bg-white/2 transition-all">
                    <td className="py-3 text-white font-medium text-sm">{s.setup}</td>
                    <td className="py-3 text-right text-white/40 text-sm">{s.trades}</td>
                    <td className="py-3 text-right"><span className={cn("font-bold text-sm", s.winRate >= 60 ? "text-emerald-400" : "text-red-400")}>{s.winRate.toFixed(0)}%</span></td>
                    <td className="py-3 text-right"><span className={cn("font-bold text-sm", s.pnl >= 0 ? "text-emerald-400" : "text-red-400")}>{s.pnl >= 0 ? "+" : ""}${Math.abs(s.pnl).toFixed(0)}</span></td>
                    <td className="py-3 text-right text-white/40 text-sm">{s.avgRR.toFixed(2)}R</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {stats.monthlyPnl.length > 0 && (
        <div className="ef-card rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Monthly P&L</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stats.monthlyPnl} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pnl" radius={[4,4,0,0]}>
                {stats.monthlyPnl.map((entry, i) => <Cell key={i} fill={entry.pnl >= 0 ? "#00ff9d" : "#ff4d6d"} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
                  }
