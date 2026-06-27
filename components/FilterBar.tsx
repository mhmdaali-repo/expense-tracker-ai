"use client";

import { Search, X } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";
import type { Filters } from "@/lib/types";

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export function FilterBar({
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const isFiltered =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="label" htmlFor="search">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="text"
              placeholder="Search description…"
              className="input pl-9"
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="input"
            value={filters.category}
            onChange={(e) =>
              set("category", e.target.value as Filters["category"])
            }
          >
            <option value="all">All categories</option>
            {CATEGORY_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="start-date">
            From
          </label>
          <input
            id="start-date"
            type="date"
            className="input"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(e) => set("startDate", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="end-date">
            To
          </label>
          <input
            id="end-date"
            type="date"
            className="input"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(e) => set("endDate", e.target.value)}
          />
        </div>

        <div className="flex items-end md:col-span-1">
          <button
            type="button"
            className="btn-ghost h-[38px] w-full"
            onClick={onReset}
            disabled={!isFiltered}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
            <span className="md:hidden">Clear</span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Showing <span className="font-medium text-slate-600">{resultCount}</span>{" "}
        of {totalCount} expenses
        {isFiltered && " (filtered)"}
      </p>
    </div>
  );
}
