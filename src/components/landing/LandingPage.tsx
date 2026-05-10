"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Check, Brain, BarChart2, Shield, Zap, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Brain, title: "AI Psychology Coach", desc: "Detects revenge trading, FOMO, and emotional patterns. Gets smarter with every trade you log.", color: "#00ff9d" },
  { icon: BarChart2, title: "Advanced Analytics", desc: "Equity curves, Monte Carlo simulations, setup profitability, and 15+ performance metrics.", color: "#00b8ff" },
  { icon: Target, title: "Trade Journal", desc: "Log trades with emotions, screenshots, confluences, and mistake checklists.", color: "#a78bfa" },
  { icon: TrendingUp, title: "Dashboard & Heatmap", desc: "Calendar heatmap, streak tracking, psychological score, and real-time PnL.", color: "#fbbf24" },
  { icon: Shield, title: "Risk Management", desc: "Automatic risk alerts, position sizing calculator, and consistency scoring.", color: "#f97316" },
  { icon: Zap, title: "Daily Routine", desc: "Pre-session checklist, rule tracker, meditation and sleep tracking.", color: "#ec4899" },
];

const TESTIMONIALS = [
  { name: "Alex M.", role: "Forex Trader · 3 years", text: "EdgeFlow's AI coach literally told me I had a revenge trading problem before I even recognized it. Win rate went from 48% to 67% in 6 weeks.", avatar: "A" },
  { name: "Sarah K.", role: "Prop Trader · FTMO funded", text: "The psychology tracking is unlike anything I have used. Finally understand why I blow accounts on Fridays.", avatar: "S" },
  { name: "Marcus T.", role: "Crypto Trader · Full-time", text: "Switched from TradeZella. The AI weekly review alone is worth the subscription. Data-driven coaching, no fluff.", avatar: "M" },
];

const STATS = [
  { value: "12,000+", label: "Active Traders" },
  { value: "$2.4M+", label: "P&L Tracked" },
  { value: "580K+", label: "Trades Logged" },
  { value: "4.9★", label: "Average Rating" },
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      <nav className={cn("fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all", scrolled ? "bg-bg/90 backdrop-blur-md border-b border-white/5" : "")}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-black text-sm ef-btn-primary">E</div>
          <span className="font-black text-white text-lg tracking-tight">EdgeFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
          <Link href="/register" className="ef-btn-primary px-4 py-2 rounded-xl text-sm">Start Free Trial</Link>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,255,157,0.07) 0%, transparent 65%)" }} />
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase" style={{ background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.2)", color: "#00ff9d" }}>
          <span className="animate-pulse">●</span> AI-Powered Trading Journal
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 max-w-5xl tracking-tight text-balance">
          Trade Smarter.<br />
          <span style={{ background: "linear-gradient(135deg,#00ff9d,#00b8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Think Clearer.</span><br />
          Win Consistently.
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed text-balance">
          The trading journal that goes beyond data. EdgeFlow combines advanced analytics with AI psychology coaching to transform serious traders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href="/register" className="ef-btn-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base">Start Free — No Card Required <ArrowRight size={16} /></Link>
          <Link href="/login" className="ef-btn-outline flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base">View Live Demo</Link>
        </div>
        <p className="text-xs text-white/20">14-day trial · Cancel anytime · Used by 12,000+ traders</p>

        <div className="mt-16 w-full max-w-5xl ef-card rounded-2xl overflow-hidden border border-white/8">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/2">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-white/10" /><div className="w-3 h-3 rounded-full bg-white/10" /><div className="w-3 h-3 rounded-full bg-white/10" /></div>
            <div className="flex-1 mx-4 bg-white/5 rounded-lg py-1.5 px-3 text-[11px] text-white/20">edgeflow.app/dashboard</div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[{ l:"Net P&L",v:"+$3,790",c:"#00ff9d"},{l:"Win Rate",v:"71.4%",c:"#00b8ff"},{l:"Avg R:R",v:"2.1R",c:"#a78bfa"},{l:"Psych Score",v:"82/100",c:"#fbbf24"}].map(({l,v,c}) => (
                <div key={l} className="bg-white/4 rounded-xl p-3">
                  <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1">{l}</div>
                  <div className="font-black text-base" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="h-24 rounded-xl bg-white/3 flex items-end px-3 pb-3 gap-1 overflow-hidden">
              {[40,55,48,65,72,61,78,85,80,92,88,95].map((h,i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height:`${h}%`, background: i > 8 ? "rgba(0,255,157,0.6)" : "rgba(0,255,157,0.25)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({value,label}) => (
            <div key={label}>
              <div className="text-3xl font-black ef-gradient-text mb-1">{value}</div>
              <div className="text-sm text-white/30">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] tracking-widest uppercase text-white/25 mb-3">Everything You Need</div>
            <h2 className="text-3xl md:text-4xl font-black">Built for Serious Traders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(({icon: Icon, title, desc, color}) => (
              <div key={title} className="ef-card-hover rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}><Icon size={18} style={{ color }} /></div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">Traders Love EdgeFlow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({name,role,text,avatar}) => (
              <div key={name} className="ef-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-base ef-btn-primary">{avatar}</div>
                  <div><div className="font-bold text-white text-sm">{name}</div><div className="text-[11px] text-white/30">{role}</div></div>
                </div>
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-sm text-white/60 leading-relaxed">&ldquo;{text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-balance">Ready to trade with <span className="ef-gradient-text">purpose</span>?</h2>
          <p className="text-white/40 text-lg mb-10">Join 12,000+ traders building consistency and edge with EdgeFlow.</p>
          <Link href="/register" className="ef-btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base">Start Free Trial <ArrowRight size={16} /></Link>
          <p className="text-xs text-white/20 mt-4">14 days free · No credit card · Cancel anytime</p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs ef-btn-primary">E</div>
            <span className="font-black text-white">EdgeFlow</span>
          </div>
          <div className="flex gap-6 text-xs text-white/25">
            <Link href="/pricing" className="hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <a href="mailto:support@edgeflow.app" className="hover:text-white/50 transition-colors">Support</a>
          </div>
          <p className="text-xs text-white/20">© 2025 EdgeFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
                        }
