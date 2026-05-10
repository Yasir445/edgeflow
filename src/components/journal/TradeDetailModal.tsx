"use client";
import { useState } from "react";
import { Trade } from "@/types";
import { X, Zap, Brain } from "lucide-react";
import { cn, formatPnl, formatDate, getScoreColor } from "@/lib/utils";

export function TradeDetailModal({ trade, onClose }: { trade: Trade; onClose: () => void }) {
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(trade.aiFeedback ?? null);
  const [activeTab, setActiveTab] = useState<"details" | "psychology" | "ai">("details");

  const generateAIFeedback = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/chat", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tradeId: trade.id }) });
      const json = await res.json();
      if (res.ok) setAiFeedback(json.data);
    } catch {}
    setLoadingAI(false);
  };

  const pnl = trade.pnl ?? 0;
  const isWin = trade.result === "WIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className="ef-modal rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-white/6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-white">{trade.pair}</h2>
              <span className={cn("text-xs px-2 py-1 rounded-lg font-bold", trade.direction === "LONG" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{trade.direction}</span>
              <span className={cn("text-xs px-2 py-1 rounded-lg font-bold", isWin ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{trade.result ?? "OPEN"}</span>
            </div>
            <p className="text-white/30 text-sm">{formatDate(trade.entryTime)} · {trade.session?.replace("_"," ") ?? "—"} · {trade.setup ?? "No setup"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("text-2xl font-black", pnl > 0 ? "text-emerald-400" : pnl < 0 ? "text-red-400" : "text-yellow-400")}>{formatPnl(pnl)}</div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/8 text-white/30 hover:text-white transition-all"><X size={16} /></button>
          </div>
        </div>

        <div className="flex border-b border-white/6">
          {(["details","psychology","ai"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={cn("flex-1 py-3 text-sm font-medium transition-all capitalize", activeTab === t ? "text-white border-b-2 border-accent-green" : "text-white/30 hover:text-white/60")}>
              {t === "ai" ? "AI Feedback" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[["Entry",trade.entryPrice],["Stop Loss",trade.stopLoss ?? "—"],["Take Profit",trade.takeProfit ?? "—"],["Exit",trade.exitPrice ?? "—"],["Position Size",trade.positionSize ?? "—"],["Risk %",trade.riskPercent ? `${trade.riskPercent}%` : "—"],["R:R",trade.riskReward ? `${trade.riskReward.toFixed(2)}R` : "—"],["Duration",trade.duration ? `${trade.duration}m` : "—"],["Timeframe",trade.timeframe ?? "—"]].map(([label, value]) => (
                  <div key={String(label)} className="bg-white/4 rounded-xl p-3">
                    <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-sm font-bold text-white">{String(value)}</div>
                  </div>
                ))}
              </div>
              {trade.notes && (
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Notes</div>
                  <p className="text-sm text-white/70 leading-relaxed">{trade.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "psychology" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Before Trade</div>
                  <div className="text-lg font-bold text-white">{trade.emotionBefore ?? "Not logged"}</div>
                </div>
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">After Trade</div>
                  <div className="text-lg font-bold text-white">{trade.emotionAfter ?? "Not logged"}</div>
                </div>
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Confidence</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent-blue" style={{ width: `${(trade.confidenceLevel ?? 0) * 10}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{trade.confidenceLevel ?? "—"}/10</span>
                  </div>
                </div>
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Execution</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent-green" style={{ width: `${(trade.executionRating ?? 0) * 10}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{trade.executionRating ?? "—"}/10</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {trade.isRevengeTrade && <div className="flex-1 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center"><div className="text-yellow-400 font-bold text-sm">⚡ Revenge Trade</div></div>}
                {trade.isFOMOTrade && <div className="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center"><div className="text-orange-400 font-bold text-sm">🎯 FOMO Trade</div></div>}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              {!aiFeedback ? (
                <div className="text-center py-8">
                  <Brain size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm mb-4">Get AI analysis of this trade</p>
                  <button onClick={generateAIFeedback} disabled={loadingAI} className="ef-btn-primary px-6 py-3 rounded-xl text-sm font-bold">
                    {loadingAI ? "Analyzing..." : "✦ Analyze with AI"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/4">
                    <div className="text-4xl font-black" style={{ color: getScoreColor(aiFeedback.qualityScore) }}>{aiFeedback.qualityScore}</div>
                    <div className="flex-1">
                      <div className="text-xs text-white/30 mb-1">Quality Score</div>
                      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${aiFeedback.qualityScore}%`, background: getScoreColor(aiFeedback.qualityScore) }} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/4 rounded-xl p-4">
                    <div className="text-[10px] text-white/25 uppercase tracking-wider mb-2">Summary</div>
                    <p className="text-sm text-white/70 leading-relaxed">{aiFeedback.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                      <div className="text-[10px] text-emerald-400/60 uppercase tracking-wider mb-2">✓ Strengths</div>
                      <ul className="space-y-1.5">{aiFeedback.strengths.map((s, i) => <li key={i} className="text-xs text-white/60">{s}</li>)}</ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                      <div className="text-[10px] text-red-400/60 uppercase tracking-wider mb-2">✗ Weaknesses</div>
                      <ul className="space-y-1.5">{aiFeedback.weaknesses.map((s, i) => <li key={i} className="text-xs text-white/60">{s}</li>)}</ul>
                    </div>
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                    <div className="text-[10px] text-blue-400/60 uppercase tracking-wider mb-2">💡 Suggestions</div>
                    <ul className="space-y-1.5">{aiFeedback.suggestions.map((s, i) => <li key={i} className="text-xs text-white/60 flex items-start gap-1.5"><span className="text-blue-400 mt-0.5">→</span>{s}</li>)}</ul>
                  </div>
                  <button onClick={generateAIFeedback} disabled={loadingAI} className="ef-btn-ghost text-xs flex items-center gap-1.5 mx-auto"><Zap size={12} /> Regenerate</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
                               }
