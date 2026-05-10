"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  pair: z.string().min(1, "Required"),
  direction: z.enum(["LONG", "SHORT"]),
  setup: z.string().optional(),
  session: z.enum(["ASIAN", "LONDON", "NEW_YORK", "OVERLAP"]).optional(),
  timeframe: z.string().optional(),
  entryPrice: z.coerce.number().positive("Must be positive"),
  stopLoss: z.coerce.number().positive().optional(),
  takeProfit: z.coerce.number().positive().optional(),
  exitPrice: z.coerce.number().positive().optional(),
  positionSize: z.coerce.number().positive().optional(),
  riskPercent: z.coerce.number().min(0).max(100).optional(),
  pnl: z.coerce.number().optional(),
  result: z.enum(["WIN", "LOSS", "BREAKEVEN", "PARTIAL"]).optional(),
  entryTime: z.string().min(1, "Required"),
  exitTime: z.string().optional(),
  emotionBefore: z.string().optional(),
  emotionAfter: z.string().optional(),
  confidenceLevel: z.coerce.number().min(1).max(10).optional(),
  executionRating: z.coerce.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const EMOTIONS = ["CALM","FOCUSED","ANXIOUS","FEARFUL","GREEDY","FOMO","FRUSTRATED","CONFIDENT","NEUTRAL","EXCITED","BORED","TIRED"];
const SESSIONS = ["ASIAN","LONDON","NEW_YORK","OVERLAP"];
const TIMEFRAMES = ["1m","5m","15m","30m","1h","4h","Daily","Weekly"];
const PAIRS = ["EUR/USD","GBP/USD","USD/JPY","GBP/JPY","XAU/USD","NAS100","SPX500","BTC/USD","ETH/USD","EUR/GBP"];

export function AddTradeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const qc = useQueryClient();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { direction: "LONG", entryTime: new Date().toISOString().slice(0, 16) },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to add trade");
      qc.invalidateQueries({ queryKey: ["trades"] });
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="ef-modal rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/6">
          <div>
            <h2 className="text-lg font-black text-white">Log Trade</h2>
            <p className="text-xs text-white/30 mt-0.5">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {["Trade Details","Risk & Result","Psychology"].map((s, i) => (
            <div key={s} className={cn("flex-1 text-center text-[10px] font-medium pb-2 border-b-2 transition-all",
              step === i + 1 ? "text-accent-green border-accent-green" : step > i + 1 ? "text-white/40 border-white/20" : "text-white/20 border-white/8")}>
              {s}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Pair *</label>
                  <input {...register("pair")} list="pairs" className="ef-input" placeholder="EUR/USD" />
                  <datalist id="pairs">{PAIRS.map(p => <option key={p} value={p} />)}</datalist>
                  {errors.pair && <p className="text-xs text-red-400 mt-1">{errors.pair.message}</p>}
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Direction *</label>
                  <div className="flex gap-2">
                    {["LONG","SHORT"].map((d) => (
                      <label key={d} className="flex-1 cursor-pointer">
                        <input {...register("direction")} type="radio" value={d} className="sr-only" />
                        <div className={cn("text-center py-2.5 rounded-xl text-sm font-bold transition-all border",
                          watch("direction") === d
                            ? d === "LONG" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-red-500/15 border-red-500/30 text-red-400"
                            : "border-white/8 text-white/30 hover:border-white/15")}>{d}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Setup</label>
                  <input {...register("setup")} className="ef-input" placeholder="Break & Retest" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Session</label>
                  <select {...register("session")} className="ef-input">
                    <option value="">Select...</option>
                    {SESSIONS.map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Timeframe</label>
                  <select {...register("timeframe")} className="ef-input">
                    <option value="">Select...</option>
                    {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Entry Time *</label>
                  <input {...register("entryTime")} type="datetime-local" className="ef-input" />
                  {errors.entryTime && <p className="text-xs text-red-400 mt-1">{errors.entryTime.message}</p>}
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Exit Time</label>
                  <input {...register("exitTime")} type="datetime-local" className="ef-input" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Entry Price *</label>
                  <input {...register("entryPrice")} type="number" step="any" className="ef-input" placeholder="1.0845" />
                  {errors.entryPrice && <p className="text-xs text-red-400 mt-1">{errors.entryPrice.message}</p>}
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Stop Loss</label>
                  <input {...register("stopLoss")} type="number" step="any" className="ef-input" placeholder="1.0810" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Take Profit</label>
                  <input {...register("takeProfit")} type="number" step="any" className="ef-input" placeholder="1.0915" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Exit Price</label>
                  <input {...register("exitPrice")} type="number" step="any" className="ef-input" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Position Size</label>
                  <input {...register("positionSize")} type="number" step="any" className="ef-input" placeholder="1.0" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Risk %</label>
                  <input {...register("riskPercent")} type="number" step="0.1" className="ef-input" placeholder="1.0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">P&L ($)</label>
                  <input {...register("pnl")} type="number" step="any" className="ef-input" placeholder="+420.00" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Result</label>
                  <select {...register("result")} className="ef-input">
                    <option value="">Select...</option>
                    {["WIN","LOSS","BREAKEVEN","PARTIAL"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Notes</label>
                <textarea {...register("notes")} className="ef-input resize-none h-24" placeholder="What went well? What could be improved?" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Emotion Before</label>
                  <select {...register("emotionBefore")} className="ef-input">
                    <option value="">How did you feel?</option>
                    {EMOTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Emotion After</label>
                  <select {...register("emotionAfter")} className="ef-input">
                    <option value="">How did you feel?</option>
                    {EMOTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Confidence (1-10)</label>
                  <input {...register("confidenceLevel")} type="range" min="1" max="10" className="w-full accent-accent-green" />
                  <div className="flex justify-between text-[9px] text-white/20"><span>Low</span><span>High</span></div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Execution (1-10)</label>
                  <input {...register("executionRating")} type="range" min="1" max="10" className="w-full accent-accent-green" />
                  <div className="flex justify-between text-[9px] text-white/20"><span>Poor</span><span>Perfect</span></div>
                </div>
              </div>
            </div>
          )}

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} className="ef-btn-ghost">
              {step > 1 ? "← Back" : "Cancel"}
            </button>
            {step < 3 ? (
              <button type="button" onClick={() => setStep(s => s + 1)} className="ef-btn-primary px-6 py-2.5 rounded-xl">Continue →</button>
            ) : (
              <button type="submit" disabled={loading} className="ef-btn-primary px-6 py-2.5 rounded-xl">
                {loading ? "Saving..." : "Save Trade ✓"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
