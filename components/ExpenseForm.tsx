"use client";

import { useEffect, useState } from "react";
import { CATEGORY_LIST } from "@/lib/categories";
import { todayISO } from "@/lib/utils";
import type { CategoryId, Expense, ExpenseInput } from "@/lib/types";

interface ExpenseFormProps {
  initial?: Expense | null;
  onSubmit: (input: ExpenseInput) => void;
  onCancel: () => void;
}

interface FormState {
  amount: string;
  category: CategoryId;
  description: string;
  date: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function buildInitialState(initial?: Expense | null): FormState {
  return {
    amount: initial ? String(initial.amount) : "",
    category: initial?.category ?? "food",
    description: initial?.description ?? "",
    date: initial?.date ?? todayISO(),
  };
}

function validate(state: FormState): FormErrors {
  const errors: FormErrors = {};

  const amount = Number(state.amount);
  if (state.amount.trim() === "") {
    errors.amount = "Amount is required.";
  } else if (Number.isNaN(amount)) {
    errors.amount = "Amount must be a number.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amount > 1_000_000) {
    errors.amount = "Amount looks too large.";
  }

  if (state.description.trim() === "") {
    errors.description = "Description is required.";
  } else if (state.description.trim().length > 120) {
    errors.description = "Keep the description under 120 characters.";
  }

  if (!state.date) {
    errors.date = "Date is required.";
  } else if (state.date > todayISO()) {
    errors.date = "Date cannot be in the future.";
  }

  return errors;
}

export function ExpenseForm({ initial, onSubmit, onCancel }: ExpenseFormProps) {
  const [state, setState] = useState<FormState>(() =>
    buildInitialState(initial)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setState(buildInitialState(initial));
    setErrors({});
    setTouched(false);
  }, [initial]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    const next = { ...state, [key]: value };
    setState(next);
    if (touched) setErrors(validate(next));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(state);
    setErrors(validationErrors);
    setTouched(true);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      amount: Math.round(Number(state.amount) * 100) / 100,
      category: state.category,
      description: state.description.trim(),
      date: state.date,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="amount" className="label">
          Amount
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            $
          </span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`input pl-7 ${
              errors.amount ? "border-rose-400 focus:ring-rose-100" : ""
            }`}
            value={state.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <select
            id="category"
            className="input"
            value={state.category}
            onChange={(e) => update("category", e.target.value as CategoryId)}
          >
            {CATEGORY_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            id="date"
            type="date"
            max={todayISO()}
            className={`input ${
              errors.date ? "border-rose-400 focus:ring-rose-100" : ""
            }`}
            value={state.date}
            onChange={(e) => update("date", e.target.value)}
          />
          {errors.date && (
            <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <input
          id="description"
          type="text"
          placeholder="e.g. Lunch with team"
          maxLength={140}
          className={`input ${
            errors.description ? "border-rose-400 focus:ring-rose-100" : ""
          }`}
          value={state.description}
          onChange={(e) => update("description", e.target.value)}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initial ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
}
