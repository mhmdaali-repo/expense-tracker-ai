"use client";

import {
  Wallet,
  CalendarDays,
  TrendingUp,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency, monthLabel, currentMonthKey } from "@/lib/utils";
import type { Summary } from "@/lib/analytics";

interface CardConfig {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent: string;
}

export function SummaryCards({ summary }: { summary: Summary }) {
  const cards: CardConfig[] = [
    {
      label: "Total Spending",
      value: formatCurrency(summary.total),
      hint: `${summary.count} ${summary.count === 1 ? "expense" : "expenses"} tracked`,
      icon: Wallet,
      accent: "bg-brand-50 text-brand-600",
    },
    {
      label: "This Month",
      value: formatCurrency(summary.monthTotal),
      hint: monthLabel(currentMonthKey()),
      icon: CalendarDays,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Top Category",
      value: summary.topCategory ? summary.topCategory.label : "—",
      hint: summary.topCategory
        ? `${formatCurrency(summary.topCategory.total)} spent`
        : "No expenses yet",
      icon: TrendingUp,
      accent: "bg-violet-50 text-violet-600",
    },
    {
      label: "Average Expense",
      value: formatCurrency(summary.average),
      hint: "Per transaction",
      icon: Hash,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card p-5 transition hover:shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              {card.label}
            </span>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.accent}`}
            >
              <card.icon className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
