"use client";
import { useState } from "react";
import { Flame, Dumbbell, Brain, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "pre_session", label: "🌅 Pre-Session", items: ["Review my trading plan","Check economic calendar","Identify key S/R levels","Set daily max risk limit","Mental state check-in","Review yesterday trades"] },
  { key: "physical", label: "💪 Physical", items: ["Morning workout / walk","Meditation (10 min)","Cold shower","Healthy breakfast","8+ hours sleep last night","No alcohol yesterday"] },
  { key: "rules", label: "📋 Trading Rules", items: ["Max 2-3 trades per session","Risk max 1% per trade","No trading first 30 min","No trading during news","Screenshot every trade","No trading when emotional"] },
  { key: "mindset", label: "🧠 Mindset", items: ["Read 10 min (non-trading)","Journaled thoughts","Visualized ideal session","Set intention for today"] },
];

export default function RoutinePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const allItems = CATEGORIES.flatMap((c) => c.items.map((item) => `${c.key}::${item}`));
  const done = allItems.filter((k) => checks[k]).length;
  const total = allItems.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Daily Routine</h1>
          <p className="text-white/30 text-sm mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-2 ef-card rounded-xl px-4 py-2">
          <Flame size={14} className="text-orange-400" />
          <span className="font-black text-white">4</span>
          <span className="text-xs text-white/30">day streak</span>
        </div>
      </div>
      <div className="ef-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-white">Today&apos;s Completion</span>
          <span className="text-2xl font-black" style={{ color: pct >= 80 ? "#00ff9d" : pct >= 50 ? "#fbbf24" : "#ff4d6d" }}>{pct}%</span>
        </div>
        <div className="h-3 bg-white/6 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct >= 80 ? "linear-gradient(90deg,#00ff9d,#00b8ff)" : pct >= 50 ? "#fbbf24" : "#ff4d6d" }} />
        </div>
        <p className="text-xs text-white/30">{done} of {total} items completed</p>
      </div>
      {CATEGORIES.map((cat) => (
        <div key={cat.key} className="ef-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">{cat.label}</h3>
            <span className="text-xs text-white/30">{cat.items.filter((i) => checks[`${cat.key}::${i}`]).length}/{cat.items.length}</span>
          </div>
          <div className="space-y-2.5">
            {cat.items.map((item) => {
              const key = `${cat.key}::${item}`;
              const checked = !!checks[key];
              return (
                <button key={item} onClick={() => setChecks((c) => ({ ...c, [key]: !c[key] }))} className="w-full flex items-center gap-3 text-left group">
                  <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                    checked ? "border-accent-green bg-accent-green" : "border-white/15 group-hover:border-white/30")}>
                    {checked && <span className="text-black text-xs font-black">✓</span>}
                  </div>
                  <span className={cn("text-sm transition-all", checked ? "text-white/25 line-through" : "text-white/70")}>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
            }
