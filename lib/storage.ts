import type { Expense } from "./types";

const STORAGE_KEY = "expense-tracker-ai:expenses";

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidExpense);
  } catch (error) {
    console.error("Failed to load expenses from localStorage:", error);
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Failed to save expenses to localStorage:", error);
  }
}

function isValidExpense(value: unknown): value is Expense {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.amount === "number" &&
    typeof e.category === "string" &&
    typeof e.description === "string" &&
    typeof e.date === "string"
  );
}
