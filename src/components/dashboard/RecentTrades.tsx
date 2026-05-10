"use client";
import { Trade } from "@/types";
import { cn, formatPnl, formatDate } from "@/lib/utils";
import Link from "next/link";

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (!trades.length) {
    return (
      <div className="text-center py-10 text-white/20">
        <p className="text-sm">No trades yet</p>
        <p className="text-xs mt-1">Add your first trade to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-12 px-3 py-2 text-[10px] uppercase tracking-widest text-white/20 font-medium">
        <span className="col-span-3">Pair & Setup</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-2">Session</span>
        <span className="col-span-2 text-right">P&L</span>
        <span className="col-span-1 text-right">R:R</span>
        <span className="col-span-2 text-right">Score</span>
      </div>
      {trades.slice(0, 8).map((t) => (
        <Link key={t.id} href={`/journal/${t.id}`}
          className="grid grid-cols-12 px-3 py-3 rounded-xl hover:bg-white/4 transition-all items-center group">
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0",
                t.result === "WIN" ? "bg-emerald-400" : t.result === "LOSS" ? "bg-red-400" : "bg-yellow-400")} />
              <span className="font-bold text-sm text-white">{t.pair}</span>
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold",
                t.direction === "LONG" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>
                {t.direction}
              </span>
            </div>
            <div className="text-[10px] text-white/25 mt-0.5 pl-3.5">{t.setup ?? "—"}</div>
          </div>
          <span className="col-span-2 text-xs text-white/40">
            {new Date(t.entryTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <span className="col-span-2 text-xs text-white/40">{t.session?.replace("_", " ") ?? "—"}</span>
          <span className={cn("col-span-2 text-sm font-bold text-right",
            (t.pnl ?? 0) > 0 ? "text-emerald-400" : (t.pnl ?? 0) < 0 ? "text-red-400" : "text-yellow-400")}>
            {t.pnl !== undefined && t.pnl !== null ? formatPnl(t.pnl) : "—"}
          </span>
          <span className="col-span-1 text-xs text-white/40 text-right">
            {t.riskReward ? `${t.riskReward.toFixed(1)}R` : "—"}
          </span>
          <div className="col-span-2 flex items-center justify-end gap-2">
            {t.qualityScore !== null && t.qualityScore !== undefined ? (
              <>
                <div className="w-10 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.qualityScore}%`, background: t.qualityScore >= 80 ? "#00ff9d" : t.qualityScore >= 60 ? "#fbbf24" : "#ff4d6d" }} />
                </div>
                <span className="text-xs text-white/40 w-6 text-right">{t.qualityScore}</span>
              </>
            ) : (
              <span className="text-xs text-white/15">—</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
                                                               }
