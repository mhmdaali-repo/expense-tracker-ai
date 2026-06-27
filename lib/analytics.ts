import { CATEGORIES, CATEGORY_LIST } from "./categories";
import { currentMonthKey, monthKey, monthLabel } from "./utils";
import type { CategoryId, Expense } from "./types";

export interface CategoryTotal {
  id: CategoryId;
  label: string;
  hex: string;
  total: number;
  count: number;
  percent: number;
}

export interface MonthlyTotal {
  key: string;
  label: string;
  total: number;
}

export interface Summary {
  total: number;
  monthTotal: number;
  count: number;
  average: number;
  topCategory: CategoryTotal | null;
  byCategory: CategoryTotal[];
  byMonth: MonthlyTotal[];
}

export function summarize(expenses: Expense[]): Summary {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = currentMonthKey();
  const monthTotal = expenses
    .filter((e) => monthKey(e.date) === thisMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  const byCategory = buildCategoryTotals(expenses, total);
  const topCategory =
    byCategory.length > 0 && byCategory[0].total > 0 ? byCategory[0] : null;

  return {
    total,
    monthTotal,
    count: expenses.length,
    average: expenses.length > 0 ? total / expenses.length : 0,
    topCategory,
    byCategory,
    byMonth: buildMonthlyTotals(expenses),
  };
}

function buildCategoryTotals(
  expenses: Expense[],
  total: number
): CategoryTotal[] {
  const totals = new Map<CategoryId, { total: number; count: number }>();
  for (const e of expenses) {
    const entry = totals.get(e.category) ?? { total: 0, count: 0 };
    entry.total += e.amount;
    entry.count += 1;
    totals.set(e.category, entry);
  }

  return CATEGORY_LIST.map((meta) => {
    const entry = totals.get(meta.id) ?? { total: 0, count: 0 };
    return {
      id: meta.id,
      label: meta.label,
      hex: meta.hex,
      total: entry.total,
      count: entry.count,
      percent: total > 0 ? (entry.total / total) * 100 : 0,
    };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);
}

/** Returns totals for the last 6 months, oldest first. */
function buildMonthlyTotals(expenses: Expense[]): MonthlyTotal[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const totals = new Map<string, number>();
  for (const e of expenses) {
    const key = monthKey(e.date);
    totals.set(key, (totals.get(key) ?? 0) + e.amount);
  }

  return months.map((key) => ({
    key,
    label: monthLabel(key),
    total: totals.get(key) ?? 0,
  }));
}

export { CATEGORIES };
