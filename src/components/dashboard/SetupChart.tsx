"use client";
import { SetupStat } from "@/types";
import { cn } from "@/lib/utils";

export function SetupChart({ data }: { data: SetupStat[] }) {
  if (!data.length) return <p className="text-white/20 text-sm text-center py-8">No setup data yet</p>;
  const maxPnl = Math.max(...data.map((d) => Math.abs(d.pnl)), 1);

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((s) => (
        <div key={s.setup}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-white font-medium truncate flex-1">{s.setup}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white/30">{s.winRate.toFixed(0)}% WR</span>
              <span className={cn("font-bold", s.pnl >= 0 ? "text-emerald-400" : "text-red-400")}>
                {s.pnl >= 0 ? "+" : ""}${Math.abs(s.pnl).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(Math.abs(s.pnl) / maxPnl) * 100}%`, background: s.pnl >= 0 ? "linear-gradient(90deg,#00ff9d,#00b8ff)" : "linear-gradient(90deg,#ff4d6d,#ff8fa3)" }} />
          </div>
          <div className="text-[10px] text-white/20 mt-0.5">{s.trades} trades · {s.avgRR.toFixed(1)}R avg</div>
        </div>
      ))}
    </div>
  );
}
