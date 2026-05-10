"use client";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  color: string;
  icon: LucideIcon;
}

export function ScoreRing({ label, value, color, icon: Icon }: Props) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg viewBox="0 0 52 52" className="w-12 h-12 -rotate-90">
          <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle cx="26" cy="26" r={radius} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={13} style={{ color }} />
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xs text-white/40">{label}</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
          </div>
          <span className="text-sm font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
    </div>
  );
}
