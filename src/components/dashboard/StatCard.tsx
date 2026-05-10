"use client";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon?: LucideIcon;
  trend?: number;
}

export function StatCard({ label, value, sub, color = "#00ff9d", icon: Icon, trend }: Props) {
  return (
    <div className="ef-card-hover rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium tracking-widest uppercase text-white/35">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon size={13} style={{ color }} />
          </div>
        )}
      </div>
      <div className="text-2xl font-black tracking-tight" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-white/30 mt-1">{sub}</div>}
      {trend !== undefined && (
        <div className={cn("text-[11px] font-semibold mt-1.5", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% vs last period
        </div>
      )}
    </div>
  );
}
