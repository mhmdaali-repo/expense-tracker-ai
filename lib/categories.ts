import {
  UtensilsCrossed,
  Car,
  Clapperboard,
  ShoppingBag,
  Receipt,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, CategoryMeta } from "./types";

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  food: {
    id: "food",
    label: "Food",
    color: "text-amber-600",
    hex: "#f59e0b",
    bg: "bg-amber-50",
  },
  transportation: {
    id: "transportation",
    label: "Transportation",
    color: "text-sky-600",
    hex: "#0ea5e9",
    bg: "bg-sky-50",
  },
  entertainment: {
    id: "entertainment",
    label: "Entertainment",
    color: "text-violet-600",
    hex: "#8b5cf6",
    bg: "bg-violet-50",
  },
  shopping: {
    id: "shopping",
    label: "Shopping",
    color: "text-pink-600",
    hex: "#ec4899",
    bg: "bg-pink-50",
  },
  bills: {
    id: "bills",
    label: "Bills",
    color: "text-rose-600",
    hex: "#f43f5e",
    bg: "bg-rose-50",
  },
  other: {
    id: "other",
    label: "Other",
    color: "text-slate-600",
    hex: "#64748b",
    bg: "bg-slate-100",
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  food: UtensilsCrossed,
  transportation: Car,
  entertainment: Clapperboard,
  shopping: ShoppingBag,
  bills: Receipt,
  other: CircleDollarSign,
};
