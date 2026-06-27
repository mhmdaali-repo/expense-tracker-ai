"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { CategoryTotal } from "@/lib/analytics";

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload as CategoryTotal;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-card-hover">
      <p className="font-semibold text-slate-900">{data.label}</p>
      <p className="text-slate-500">
        {formatCurrency(data.total)} · {data.percent.toFixed(1)}%
      </p>
    </div>
  );
}

export function CategoryPieChart({ data }: { data: CategoryTotal[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.hex} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
