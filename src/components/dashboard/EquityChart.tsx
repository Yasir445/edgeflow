"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { EquityPoint } from "@/types";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ef-card rounded-xl p-3 text-xs">
      <p className="text-white/40 mb-1">{label}</p>
      <p className="font-bold text-accent-green">${payload[0]?.value?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      {payload[0]?.payload?.drawdown > 0 && <p className="text-red-400">DD: -{payload[0].payload.drawdown.toFixed(1)}%</p>}
    </div>
  );
};

export function EquityChart({ data }: { data: EquityPoint[] }) {
  if (!data.length) {
    return <div className="h-[160px] flex items-center justify-center text-white/20 text-sm">No trades yet — start logging to see your equity curve</div>;
  }

  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const isPositive = data[data.length - 1]?.value >= data[0]?.value;
  const color = isPositive ? "#00ff9d" : "#ff4d6d";

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.2)" }} axisLine={false} tickLine={false} domain={[min * 0.98, max * 1.02]} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#equityGrad)" dot={false} activeDot={{ r: 4, fill: color, stroke: "transparent" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
