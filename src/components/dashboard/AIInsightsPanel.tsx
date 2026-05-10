"use client";
import { AIInsight } from "@/types";
import { cn } from "@/lib/utils";

export function AIInsightsPanel({ insights }: { insights: AIInsight[] }) {
  return (
    <div className="ef-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">AI Insights</h3>
        <span className="ef-badge-ai">✦ AI</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <div key={i} className={cn("p-4 rounded-xl border",
            ins.type === "warning" ? "bg-yellow-500/5 border-yellow-500/15" :
            ins.type === "success" ? "bg-emerald-500/5 border-emerald-500/15" :
            ins.type === "error" ? "bg-red-500/5 border-red-500/15" :
            "bg-blue-500/5 border-blue-500/15")}>
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{ins.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{ins.title}</p>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">{ins.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
