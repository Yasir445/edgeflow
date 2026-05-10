"use client";
import { useState, useMemo } from "react";
import { Trade } from "@/types";
import { cn, formatPnl, formatDate } from "@/lib/utils";
import { Search, Download, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { TradeDetailModal } from "@/components/journal/TradeDetailModal";
import { AddTradeModal } from "@/components/journal/AddTradeModal";

type SortKey = "entryTime" | "pnl" | "riskReward" | "qualityScore";
type SortDir = "asc" | "desc";

export function JournalClient({ initialTrades }: { initialTrades: Trade[] }) {
  const [trades] = useState<Trade[]>(initialTrades);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [dirFilter, setDirFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("entryTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let list = [...trades];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.pair.toLowerCase().includes(q) || t.setup?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q));
    }
    if (resultFilter !== "ALL") list = list.filter((t) => t.result === resultFilter);
    if (dirFilter !== "ALL") list = list.filter((t) => t.direction === dirFilter);
    list.sort((a, b) => {
      let va: number, vb: number;
      if (sortKey === "entryTime") { va = new Date(a.entryTime).getTime(); vb = new Date(b.entryTime).getTime(); }
      else { va = (a[sortKey] as number) ?? 0; vb = (b[sortKey] as number) ?? 0; }
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return list;
  }, [trades, search, resultFilter, dirFilter, sortKey, sortDir]);

  const wins = filtered.filter((t) => t.result === "WIN").length;
  const losses = filtered.filter((t) => t.result === "LOSS").length;
  const totalPnl = filtered.reduce((s, t) => s + (t.pnl ?? 0), 0);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  return (
    <>
      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Trade Journal</h1>
            <p className="text-white/30 text-sm mt-0.5">{trades.length} trades logged</p>
          </div>
          <div className="flex gap-3">
            <button className="ef-btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Download size={14} /> Export CSV</button>
            <button onClick={() => setShowAdd(true)} className="ef-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={14} /> Log Trade</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total P&L", value: formatPnl(totalPnl), color: totalPnl >= 0 ? "#00ff9d" : "#ff4d6d" },
            { label: "Win Rate", value: filtered.length ? `${((wins / filtered.length) * 100).toFixed(1)}%` : "—", color: "#00b8ff" },
            { label: "Wins / Losses", value: `${wins} / ${losses}`, color: "#a78bfa" },
            { label: "Filtered", value: String(filtered.length), color: "#fbbf24" },
          ].map(({ label, value, color }) => (
            <div key={label} className="ef-card rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-white/30">{label}</div>
              <div className="text-xl font-black mt-1" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 ef-card rounded-xl px-3 py-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-white/25 flex-shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pair, setup, notes..." className="bg-transparent text-sm text-white placeholder-white/20 outline-none w-full" />
          </div>
          <div className="flex gap-1">
            {["ALL","WIN","LOSS","BREAKEVEN"].map((f) => (
              <button key={f} onClick={() => setResultFilter(f)} className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-all", resultFilter === f ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/4")}>{f}</button>
            ))}
          </div>
          <div className="flex gap-1">
            {["ALL","LONG","SHORT"].map((f) => (
              <button key={f} onClick={() => setDirFilter(f)} className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-all",
                dirFilter === f ? f === "LONG" ? "bg-emerald-500/15 text-emerald-400" : f === "SHORT" ? "bg-red-500/15 text-red-400" : "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/4")}>{f}</button>
            ))}
          </div>
        </div>

        <div className="ef-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-widest text-white/20 font-medium border-b border-white/5">
            <button className="col-span-2 text-left flex items-center gap-1 hover:text-white/40" onClick={() => toggleSort("entryTime")}>Date <SortIcon k="entryTime" /></button>
            <span className="col-span-2">Pair</span>
            <span className="col-span-2">Setup</span>
            <span className="col-span-1">Session</span>
            <button className="col-span-2 text-right flex items-center justify-end gap-1 hover:text-white/40" onClick={() => toggleSort("pnl")}>P&L <SortIcon k="pnl" /></button>
            <button className="col-span-1 text-right flex items-center justify-end gap-1 hover:text-white/40" onClick={() => toggleSort("riskReward")}>RR <SortIcon k="riskReward" /></button>
            <button className="col-span-2 text-right flex items-center justify-end gap-1 hover:text-white/40" onClick={() => toggleSort("qualityScore")}>Score <SortIcon k="qualityScore" /></button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-white/20 text-sm">No trades match your filters</p>
              <button onClick={() => setShowAdd(true)} className="mt-4 ef-btn-primary px-5 py-2 rounded-xl text-sm">Log your first trade</button>
            </div>
          ) : (
            <div className="divide-y divide-white/4">
              {filtered.map((t) => (
                <button key={t.id} onClick={() => setSelected(t)} className="w-full grid grid-cols-12 px-5 py-4 hover:bg-white/3 transition-all items-center text-left group">
                  <div className="col-span-2">
                    <div className="text-xs text-white/50">{formatDate(t.entryTime, { month: "short", day: "numeric" })}</div>
                    <div className="text-[10px] text-white/20 mt-0.5">{t.duration ? `${t.duration}m` : "—"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", t.result === "WIN" ? "bg-emerald-400" : t.result === "LOSS" ? "bg-red-400" : "bg-yellow-400")} />
                      <span className="font-bold text-sm text-white">{t.pair}</span>
                    </div>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5 inline-block", t.direction === "LONG" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{t.direction}</span>
                  </div>
                  <div className="col-span-2"><span className="text-xs text-white/50">{t.setup ?? "—"}</span></div>
                  <div className="col-span-1"><span className="text-xs text-white/30">{t.session?.replace("_", " ") ?? "—"}</span></div>
                  <div className="col-span-2 text-right">
                    <div className={cn("font-bold text-sm", (t.pnl ?? 0) > 0 ? "text-emerald-400" : (t.pnl ?? 0) < 0 ? "text-red-400" : "text-yellow-400")}>
                      {t.pnl !== undefined && t.pnl !== null ? formatPnl(t.pnl) : "—"}
                    </div>
                    {t.riskPercent && <div className="text-[10px] text-white/20">{t.riskPercent}% risk</div>}
                  </div>
                  <div className="col-span-1 text-right"><span className="text-xs text-white/40">{t.riskReward ? `${t.riskReward.toFixed(1)}R` : "—"}</span></div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {t.qualityScore !== null && t.qualityScore !== undefined ? (
                      <>
                        <div className="w-12 h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${t.qualityScore}%`, background: t.qualityScore >= 80 ? "#00ff9d" : t.qualityScore >= 60 ? "#fbbf24" : "#ff4d6d" }} />
                        </div>
                        <span className="text-xs text-white/40 w-6 text-right">{t.qualityScore}</span>
                      </>
                    ) : <span className="text-xs text-white/15">—</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {selected && <TradeDetailModal trade={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddTradeModal onClose={() => setShowAdd(false)} />}
    </>
  );
      }
