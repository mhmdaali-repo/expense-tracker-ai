"use client";
// dark mode coming soon

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, PieChart as PieIcon, BarChart3, ArrowRight, Download } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/components/Toast";
import { summarize } from "@/lib/analytics";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SummaryCards } from "@/components/SummaryCards";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { MonthlyBarChart } from "@/components/MonthlyBarChart";
import { CategoryIconTile } from "@/components/CategoryBadge";
import { Modal } from "@/components/Modal";
import { ExpenseForm } from "@/components/ExpenseForm";
import { EmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/Skeleton";
import type { Expense, ExpenseInput } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

export default function DashboardPage() {
  const { expenses, isLoading, addExpense } = useExpenses();
  const { notify } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);

  const summary = useMemo(() => summarize(expenses), [expenses]);
  const recent = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 5),
    [expenses]
  );

  function exportCSV(data: Expense[]) {
    const rows = [
      ["Date", "Category", "Amount", "Description"],
      ...data
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((e) => [
          e.date,
          CATEGORIES[e.category].label,
          e.amount.toFixed(2),
          `"${e.description.replace(/"/g, '""')}"`,
        ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAdd(input: ExpenseInput) {
    addExpense(input);
    setFormOpen(false);
    notify("Expense added successfully");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            An overview of your spending and trends.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => exportCSV(expenses)}
            disabled={expenses.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : expenses.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No expenses yet"
            description="Start tracking your spending by adding your first expense. Your dashboard will come to life with summaries and charts."
            action={
              <button className="btn-primary" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" />
                Add your first expense
              </button>
            }
          />
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-brand-600" />
                <h2 className="font-semibold text-slate-900">
                  Spending by Category
                </h2>
              </div>
              <CategoryPieChart data={summary.byCategory} />
              <ul className="mt-4 space-y-2">
                {summary.byCategory.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: cat.hex }}
                      />
                      {cat.label}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(cat.total)}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        {cat.percent.toFixed(0)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-brand-600" />
                <h2 className="font-semibold text-slate-900">
                  Monthly Trend
                </h2>
              </div>
              <MonthlyBarChart data={summary.byMonth} />
              <p className="mt-4 text-xs text-slate-400">
                Total spending over the last 6 months.
              </p>
            </section>
          </div>

          <section className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Recent Expenses</h2>
              <Link
                href="/expenses"
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {recent.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <CategoryIconTile category={expense.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {expense.description}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <p className="font-semibold tracking-tight text-slate-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Modal
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        title="Add Expense"
        description="Record a new expense to keep your tracker up to date."
      >
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
