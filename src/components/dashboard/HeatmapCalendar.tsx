"use client";
import { Trade } from "@/types";
import { useMemo } from "react";

export function HeatmapCalendar({ trades }: { trades: Trade[] }) {
  const weeks = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of trades) {
      const d = new Date(t.entryTime).toISOString().split("T")[0];
      map.set(d, (map.get(d) ?? 0) + (t.pnl ?? 0));
    }
    const today = new Date();
    const days: { date: string; pnl: number }[][] = [];
    for (let w = 9; w >= 0; w--) {
      const week: { date: string; pnl: number }[] = [];
      for (let d = 0; d < 5; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - w * 7 - (today.getDay() - 1 - d));
        const key = date.toISOString().split("T")[0];
        week.push({ date: key, pnl: map.get(key) ?? 0 });
      }
      days.push(week);
    }
    return days;
  }, [trades]);

  const maxAbs = Math.max(...weeks.flat().map((d) => Math.abs(d.pnl)), 1);

  return (
    <div>
      <div className="flex gap-1.5 mb-2">
        {["Mon","Tue","Wed","Thu","Fri"].map((d) => (
          <div key={d} className="flex-1 text-[9px] text-white/15 text-center">{d}</div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex-1 flex flex-col gap-1.5">
            {week.map((cell) => {
              const intensity = Math.min(Math.abs(cell.pnl) / maxAbs, 1);
              const bg = cell.pnl > 0 ? `rgba(0,255,157,${intensity * 0.85})` : cell.pnl < 0 ? `rgba(255,77,109,${intensity * 0.85})` : "rgba(255,255,255,0.04)";
              return <div key={cell.date} title={`${cell.date}: ${cell.pnl >= 0 ? "+" : ""}$${cell.pnl.toFixed(0)}`} className="aspect-square rounded-sm cursor-pointer hover:scale-110 transition-transform" style={{ background: bg }} />;
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-[9px] text-white/20">Loss</span>
        <div className="flex gap-0.5">
          {[0.8,0.4,0.1,0.04,0.1,0.4,0.8].map((o, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: i < 3 ? `rgba(255,77,109,${o})` : i === 3 ? "rgba(255,255,255,0.04)" : `rgba(0,255,157,${o})` }} />
          ))}
        </div>
        <span className="text-[9px] text-white/20">Win</span>
      </div>
    </div>
  );
          }
