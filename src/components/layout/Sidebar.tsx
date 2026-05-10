"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, BookOpen, BarChart2, Brain, CheckSquare, Settings, LogOut, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/ai-coach", label: "AI Coach", icon: Brain, badge: "AI" },
  { href: "/routine", label: "Routine", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="ef-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm ef-btn-primary">E</div>
          <span className="font-black text-white text-lg tracking-tight">EdgeFlow</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 py-2 font-medium">Menu</p>
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active ? "bg-white/8 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4")}>
              <Icon size={16} className={cn(active ? "text-white" : "text-white/40 group-hover:text-white/60")} />
              <span className="flex-1">{label}</span>
              {badge && <span className="ef-badge-ai">{badge}</span>}
              {active && <ChevronRight size={12} className="text-white/30" />}
            </Link>
          );
        })}
        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 py-2 font-medium">Account</p>
          <Link href="/settings"
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname === "/settings" ? "bg-white/8 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/4")}>
            <Settings size={16} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
      <div className="p-3 border-t border-white/5">
        <div className="ef-card rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Pro Plan</span>
            <TrendingUp size={12} className="text-accent-green" />
          </div>
          <div className="ef-score-bar mb-1.5">
            <div className="h-full w-3/4 rounded-full bg-gradient-accent" />
          </div>
          <p className="text-[10px] text-white/30">75 / 100 trades</p>
        </div>
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg ef-btn-primary flex items-center justify-center text-black font-bold text-xs flex-shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "E"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{session?.user?.name ?? "Trader"}</p>
            <p className="text-[10px] text-white/30 truncate">{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-white/20 hover:text-white/60 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
              }
