"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, CreditCard, Bell, Database, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "subscription" | "notifications" | "data" | "privacy";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("profile");
  const [notifications, setNotifications] = useState({ riskWarnings: true, weeklyReports: true, dailyReminders: false, ruleViolations: true, achievements: false });
  const [currency, setCurrency] = useState("USD");

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "data", label: "Data & Export", icon: Database },
    { id: "privacy", label: "Privacy", icon: Shield },
  ] as const;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/30 text-sm mt-0.5">Manage your account and preferences</p>
      </div>
      <div className="flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id as Tab)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  tab === id ? "bg-white/8 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4")}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 space-y-4">
          {tab === "profile" && (
            <div className="ef-card rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white border-b border-white/5 pb-3">Profile</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-black ef-btn-primary flex-shrink-0">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "E"}
                </div>
                <div>
                  <p className="font-bold text-white">{session?.user?.name ?? "Trader"}</p>
                  <p className="text-sm text-white/40">{session?.user?.email}</p>
                  <span className="ef-badge-ai mt-1 inline-block">Pro Plan</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Display Name</label>
                  <input defaultValue={session?.user?.name ?? ""} className="ef-input" />
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="ef-input">
                    {["USD","EUR","GBP","JPY","CHF","AUD","CAD"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="ef-btn-primary px-5 py-2.5 rounded-xl text-sm">Save Changes</button>
            </div>
          )}
          {tab === "subscription" && (
            <div className="ef-card rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white border-b border-white/5 pb-3">Subscription</h2>
              <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(0,255,157,0.08),rgba(0,184,255,0.08))", border: "1px solid rgba(0,255,157,0.15)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-black text-white">Pro Plan</div>
                    <div className="text-sm text-white/40">$29/month</div>
                  </div>
                  <span className="ef-badge-ai">Active</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all">Cancel Subscription</button>
            </div>
          )}
          {tab === "notifications" && (
            <div className="ef-card rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white border-b border-white/5 pb-3">Notifications</h2>
              {Object.entries({ riskWarnings: "Risk warnings", weeklyReports: "Weekly performance reports", dailyReminders: "Daily journal reminders", ruleViolations: "Rule violation alerts", achievements: "Achievement notifications" }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{label}</span>
                  <button onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                    className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                    style={notifications[key as keyof typeof notifications] ? { background: "linear-gradient(90deg,#00ff9d,#00b8ff)" } : { background: "rgba(255,255,255,0.12)" }}>
                    <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all", notifications[key as keyof typeof notifications] ? "left-[calc(100%-20px)]" : "left-1")} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {tab === "data" && (
            <div className="ef-card rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white border-b border-white/5 pb-3">Data & Export</h2>
              <div className="space-y-3">
                {[["Export trades as CSV","Download all your trade data"],["Export journal as PDF","Full journal with charts"],["Import from broker CSV","MT4/5, cTrader, IBKR supported"]].map(([label, desc]) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                    <div>
                      <div className="text-sm font-medium text-white">{label}</div>
                      <div className="text-xs text-white/30">{desc}</div>
                    </div>
                    <button className="ef-btn-outline px-4 py-2 rounded-lg text-xs">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "privacy" && (
            <div className="ef-card rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white border-b border-white/5 pb-3">Privacy</h2>
              <p className="text-sm text-white/50 leading-relaxed">Your trading data is <span className="text-white font-medium">private by default</span>. Only you can see your journal, trades, and analytics. We never sell your data.</p>
              <button className="w-full py-3 rounded-xl text-sm border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all">Delete My Account & All Data</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
              }
