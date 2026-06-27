"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  type TooltipProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyTotal } from "@/lib/analytics";

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-slate-500">{formatCurrency(Number(payload[0].value))}</p>
    </div>
  );
}

export function MonthlyBarChart({ data }: { data: MonthlyTotal[] }) {
  const max = Math.max(...data.map((d) => d.total), 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(v) => (v === 0 ? "0" : `$${Math.round(v)}`)}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.total === max && max > 0 ? "#1a4ff5" : "#93b4ff"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
