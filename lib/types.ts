export type CategoryId =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "bills"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  createdAt: string;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Tailwind text/border accent color */
  color: string;
  /** Hex color used by charts */
  hex: string;
  /** Soft background tint class */
  bg: string;
}

export interface Filters {
  search: string;
  category: CategoryId | "all";
  startDate: string;
  endDate: string;
}
