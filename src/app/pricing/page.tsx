"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PLANS = [
  {
    name: "Free", price: 0, priceId: null, period: "forever",
    description: "For traders just getting started",
    features: ["25 trades per month","Basic journal & notes","Core dashboard stats","Mobile app access","CSV export"],
    missing: ["AI Coach","Screenshot uploads","Advanced analytics","Broker import"],
    cta: "Get Started Free", highlight: false,
  },
  {
    name: "Pro", price: 29, priceId: "PRO", period: "/month",
    description: "For serious traders ready to level up",
    features: ["Unlimited trades","AI Psychology Coach","Advanced analytics suite","Screenshot uploads","Broker CSV import","Weekly AI review","API access","Priority support"],
    missing: [], cta: "Start 14-Day Trial", highlight: true, trial: true,
  },
  {
    name: "Elite", price: 79, priceId: "ELITE", period: "/month",
    description: "For prop traders and professionals",
    features: ["Everything in Pro","Multi-account (up to 10)","Team features","Dedicated onboarding","Custom integrations","SLA support","Early access"],
    missing: [], cta: "Contact Sales", highlight: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) { router.push(session ? "/dashboard" : "/register"); return; }
    if (!session) { router.push("/register"); return; }
    if (planName === "Elite") { window.location.href = "mailto:sales@edgeflow.app?subject=Elite Plan"; return; }
    setLoading(planName);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: priceId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch { setLoading(null); }
  };

  return (
    <div className="min-h-screen bg-bg">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black ef-btn-primary text-sm">E</div>
          <span className="font-black text-white">EdgeFlow</span>
        </Link>
        <div className="flex gap-3">
          <Link href="/login" className="ef-btn-ghost px-4 py-2 text-sm rounded-xl">Sign in</Link>
          <Link href="/register" className="ef-btn-primary px-4 py-2 rounded-xl text-sm">Start Free</Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-[11px] tracking-widest uppercase text-white/30 mb-4">Pricing</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">Start free. Upgrade when you are ready to take your trading seriously.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name} className={cn("rounded-2xl p-7 flex flex-col relative", plan.highlight ? "border border-accent-green/30" : "ef-card border border-white/6")}
              style={plan.highlight ? { background: "linear-gradient(135deg,rgba(0,255,157,0.06),rgba(0,184,255,0.06))" } : {}}>
              {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 ef-btn-primary px-4 py-1 rounded-full text-[11px] font-black tracking-wider">MOST POPULAR</div>}
              <div className="mb-5">
                <h3 className="text-white/50 text-sm font-medium mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-white/30 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-white/30">{plan.description}</p>
              </div>
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="text-accent-green flex-shrink-0 mt-0.5" />
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm opacity-30">
                    <span className="w-3.5 flex-shrink-0 text-center">—</span>
                    <span className="text-white/40 line-through">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(plan.priceId, plan.name)} disabled={loading === plan.name}
                className={cn("w-full py-3 rounded-xl font-bold text-sm transition-all", plan.highlight ? "ef-btn-primary" : "border border-white/10 text-white/70 hover:text-white hover:border-white/20")}>
                {loading === plan.name ? "Redirecting..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
      }
