"use client";

import { CATEGORIES, CATEGORY_ICONS } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

export function CategoryBadge({ category }: { category: CategoryId }) {
  const meta = CATEGORIES[category];
  const Icon = CATEGORY_ICONS[category];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.bg} ${meta.color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export function CategoryIconTile({ category }: { category: CategoryId }) {
  const meta = CATEGORIES[category];
  const Icon = CATEGORY_ICONS[category];

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}
