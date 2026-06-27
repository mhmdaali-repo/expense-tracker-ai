"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  FileSpreadsheet,
  FileJson,
  FileText,
  Download,
  Loader2,
  Calendar,
  Tag,
} from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";
import { formatCurrency, formatDate, todayISO } from "@/lib/utils";
import { filterExpenses, exportAsCsv, exportAsJson, exportAsPdf } from "@/lib/export";
import type { CategoryId, Expense } from "@/lib/types";

type ExportFormat = "csv" | "json" | "pdf";

const FORMATS: {
  id: ExportFormat;
  label: string;
  ext: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "csv",
    label: "CSV",
    ext: ".csv",
    description: "Open in Excel or Sheets",
    icon: FileSpreadsheet,
  },
  {
    id: "json",
    label: "JSON",
    ext: ".json",
    description: "Machine-readable data",
    icon: FileJson,
  },
  {
    id: "pdf",
    label: "PDF",
    ext: ".pdf",
    description: "Print-ready report",
    icon: FileText,
  },
];

const PREVIEW_LIMIT = 8;

interface Props {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export function ExportModal({ open, onClose, expenses }: Props) {
  const today = todayISO();

  const [format, setFormat] = useState<ExportFormat>("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(today);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    CATEGORY_LIST.map((c) => c.id)
  );
  const [filename, setFilename] = useState(`expenses-${today}`);
  const [isExporting, setIsExporting] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(
    () =>
      filterExpenses(expenses, {
        startDate,
        endDate,
        categories: selectedCategories,
      }),
    [expenses, startDate, endDate, selectedCategories]
  );

  const totalAmount = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  const previewRows = filtered.slice(0, PREVIEW_LIMIT);
  const overflowCount = filtered.length - PREVIEW_LIMIT;

  function toggleCategory(id: CategoryId) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function toggleAllCategories() {
    setSelectedCategories(
      selectedCategories.length === CATEGORY_LIST.length
        ? []
        : CATEGORY_LIST.map((c) => c.id)
    );
  }

  async function handleExport() {
    if (filtered.length === 0) return;
    setIsExporting(true);
    // Small delay so the loading state is visible
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (format === "csv") exportAsCsv(filtered, filename);
      else if (format === "json") exportAsJson(filtered, filename);
      else exportAsPdf(filtered, filename);
      onClose();
    } finally {
      setIsExporting(false);
    }
  }

  if (!open) return null;

  const allSelected = selectedCategories.length === CATEGORY_LIST.length;
  const ext = FORMATS.find((f) => f.id === format)?.ext ?? "";

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Export Expenses"
        className="relative z-10 w-full max-w-3xl rounded-t-2xl bg-white shadow-card-hover animate-slide-up sm:rounded-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Export Expenses</h2>
            <p className="text-sm text-slate-500">
              Choose a format, apply filters, then download.
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost rounded-lg p-2 -mr-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-[272px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

            {/* ── Left panel: controls ── */}
            <div className="p-6 space-y-6">

              {/* Format selector */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((f) => {
                    const Icon = f.icon;
                    const active = format === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition ${
                          active
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-semibold">{f.label}</span>
                        <span className="text-[10px] leading-tight text-current opacity-70">
                          {f.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date range */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Date Range
                </label>
                <div className="space-y-2">
                  <div>
                    <span className="mb-1 block text-xs text-slate-500">From</span>
                    <input
                      type="date"
                      className="input"
                      value={startDate}
                      max={endDate || today}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="mb-1 block text-xs text-slate-500">To</span>
                    <input
                      type="date"
                      className="input"
                      value={endDate}
                      min={startDate}
                      max={today}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    Categories
                  </label>
                  <button
                    onClick={toggleAllCategories}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    {allSelected ? "Deselect all" : "Select all"}
                  </button>
                </div>
                <div className="space-y-1.5">
                  {CATEGORY_LIST.map((cat) => {
                    const checked = selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-brand-600"
                        />
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.hex }}
                        />
                        <span className="text-sm text-slate-700">{cat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filename */}
              <div>
                <label className="label">Filename</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="input rounded-r-none border-r-0"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value || `expenses-${today}`)}
                    placeholder={`expenses-${today}`}
                  />
                  <span className="flex h-9 items-center rounded-r-lg border border-slate-300 bg-slate-50 px-2.5 text-xs text-slate-500 shrink-0">
                    {ext}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right panel: preview ── */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Preview</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {filtered.length} {filtered.length === 1 ? "record" : "records"}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <FileSpreadsheet className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No records match</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Adjust your filters to see data.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Date
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Category
                          </th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Amount
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewRows.map((e) => (
                          <tr key={e.id} className="hover:bg-slate-50 transition">
                            <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                              {formatDate(e.date)}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="inline-flex items-center gap-1.5 text-slate-700">
                                <span
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      CATEGORY_LIST.find((c) => c.id === e.category)?.hex,
                                  }}
                                />
                                {CATEGORY_LIST.find((c) => c.id === e.category)?.label}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium tabular-nums text-slate-900">
                              {formatCurrency(e.amount)}
                            </td>
                            <td className="max-w-[180px] truncate px-3 py-2.5 text-slate-600">
                              {e.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {overflowCount > 0 && (
                    <p className="text-center text-xs text-slate-400">
                      Showing {PREVIEW_LIMIT} of {filtered.length} records —{" "}
                      <span className="font-medium text-slate-500">
                        +{overflowCount} more will be included in the export
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 shrink-0">
          <div className="text-sm">
            {filtered.length > 0 ? (
              <>
                <span className="font-semibold text-slate-900">
                  {filtered.length} {filtered.length === 1 ? "record" : "records"}
                </span>
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(totalAmount)}
                </span>
                <span className="ml-1.5 text-slate-400">total</span>
              </>
            ) : (
              <span className="text-slate-400">No records selected</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary min-w-[110px]"
              onClick={handleExport}
              disabled={filtered.length === 0 || isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export {format.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
