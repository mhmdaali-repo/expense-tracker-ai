"use client";

import { Pencil, Trash2 } from "lucide-react";
import { CategoryIconTile } from "./CategoryBadge";
import { CATEGORIES } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  return (
    <ul className="divide-y divide-slate-100">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-slate-50 sm:px-5"
        >
          <CategoryIconTile category={expense.category} />

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-900">
              {expense.description}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              <span className={CATEGORIES[expense.category].color}>
                {CATEGORIES[expense.category].label}
              </span>
              {" · "}
              {formatDate(expense.date)}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold tracking-tight text-slate-900">
              {formatCurrency(expense.amount)}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              className="btn-ghost rounded-lg p-2"
              onClick={() => onEdit(expense)}
              aria-label={`Edit ${expense.description}`}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              onClick={() => onDelete(expense)}
              aria-label={`Delete ${expense.description}`}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
