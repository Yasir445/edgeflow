export const dynamic = "force-dynamic";

"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Brain, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { role: "user" | "assistant"; content: string; timestamp: string; }

const QUICK_PROMPTS = [
  "Why do I keep revenge trading?",
  "Analyze my worst psychological patterns",
  "How can I improve my win rate?",
  "Give me a pre-session routine",
  "Why is my risk inconsistent?",
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hey trader. I am your EdgeFlow AI Coach. Ask me anything about your trading performance, psychology, or patterns.",
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setMessages((m) => [...m, { role: "assistant", content: json.data.reply, timestamp: new Date().toISOString() }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${e.message}`, timestamp: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-6 gap-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Brain size={20} className="text-accent-green" /> AI Coach
          </h1>
          <p className="text-white/30 text-sm mt-0.5">Powered by Claude</p>
        </div>
        <span className="ef-badge-ai">✦ LIVE AI</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Psych Score", value: "—", icon: Brain, color: "#00ff9d" },
          { label: "Risk Score", value: "—", icon: Shield, color: "#fbbf24" },
          { label: "Discipline", value: "—", icon: Zap, color: "#00b8ff" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="ef-card rounded-xl p-4 text-center">
            <Icon size={14} style={{ color }} className="mx-auto mb-1" />
            <div className="text-xl font-black" style={{ color }}>{value}</div>
            <div className="text-[10px] text-white/25 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
              style={m.role === "assistant"
                ? { background: "linear-gradient(135deg,#00ff9d,#00b8ff)", color: "#000" }
                : { background: "rgba(255,255,255,0.08)", color: "white" }}>
              {m.role === "assistant" ? "✦" : "U"}
            </div>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
              style={m.role === "assistant"
                ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" }
                : { background: "linear-gradient(135deg,rgba(0,255,157,0.12),rgba(0,184,255,0.12))", border: "1px solid rgba(0,255,157,0.15)", color: "white" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
              style={{ background: "linear-gradient(135deg,#00ff9d,#00b8ff)", color: "#000" }}>✦</div>
            <div className="ef-card rounded-2xl px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 0.2, 0.4].map((d) => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-accent-green"
                    style={{ animation: `bounce 1.2s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {QUICK_PROMPTS.map((p) => (
          <button key={p} onClick={() => send(p)} disabled={loading}
            className="text-[11px] px-3 py-1.5 rounded-xl border border-white/8 text-white/40 hover:text-white/70 hover:border-white/15 transition-all">
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask your AI coach anything..."
          className="ef-input flex-1" />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="ef-btn-primary w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40">
          <Send size={14} />
        </button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
