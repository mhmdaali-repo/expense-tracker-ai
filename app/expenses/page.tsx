"use client";

import { useMemo, useState } from "react";
import { Plus, Download, ReceiptText, SearchX } from "lucide-react";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/components/Toast";
import { FilterBar } from "@/components/FilterBar";
import { ExpenseList } from "@/components/ExpenseList";
import { Modal } from "@/components/Modal";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeleton";
import { expensesToCsv, downloadCsv, formatCurrency, todayISO } from "@/lib/utils";
import type { Expense, ExpenseInput, Filters } from "@/lib/types";

const EMPTY_FILTERS: Filters = {
  search: "",
  category: "all",
  startDate: "",
  endDate: "",
};

export default function ExpensesPage() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const { notify } = useToast();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return expenses
      .filter((e) => {
        if (search && !e.description.toLowerCase().includes(search)) {
          return false;
        }
        if (filters.category !== "all" && e.category !== filters.category) {
          return false;
        }
        if (filters.startDate && e.date < filters.startDate) return false;
        if (filters.endDate && e.date > filters.endDate) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [expenses, filters]);

  const filteredTotal = useMemo(
    () => filtered.reduce((sum, e) => sum + e.amount, 0),
    [filtered]
  );

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setFormOpen(true);
  }

  function handleSubmit(input: ExpenseInput) {
    if (editing) {
      updateExpense(editing.id, input);
      notify("Expense updated");
    } else {
      addExpense(input);
      notify("Expense added successfully");
    }
    setFormOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteExpense(deleting.id);
    notify("Expense deleted", "info");
    setDeleting(null);
  }

  function handleExport() {
    if (filtered.length === 0) {
      notify("No expenses to export", "error");
      return;
    }
    const csv = expensesToCsv(filtered);
    downloadCsv(`expenses-${todayISO()}.csv`, csv);
    notify(`Exported ${filtered.length} expenses to CSV`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, edit, and export your expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            onClick={handleExport}
            disabled={isLoading || filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="btn-primary" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : expenses.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ReceiptText}
            title="No expenses yet"
            description="You haven't tracked any expenses. Add one to get started."
            action={
              <button className="btn-primary" onClick={openAdd}>
                <Plus className="h-4 w-4" />
                Add your first expense
              </button>
            }
          />
        </div>
      ) : (
        <>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
            resultCount={filtered.length}
            totalCount={expenses.length}
          />

          {filtered.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm">
              <span className="font-medium text-brand-800">
                Filtered total
              </span>
              <span className="text-lg font-bold tracking-tight text-brand-900">
                {formatCurrency(filteredTotal)}
              </span>
            </div>
          )}

          <div className="card overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No matching expenses"
                description="Try adjusting your search terms or filters to find what you're looking for."
                action={
                  <button
                    className="btn-secondary"
                    onClick={() => setFilters(EMPTY_FILTERS)}
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <ExpenseList
                expenses={filtered}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            )}
          </div>
        </>
      )}

      <Modal
        open={isFormOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Expense" : "Add Expense"}
        description={
          editing
            ? "Update the details of this expense."
            : "Record a new expense to keep your tracker up to date."
        }
      >
        <ExpenseForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete expense?"
        message={
          deleting
            ? `"${deleting.description}" (${formatCurrency(
                deleting.amount
              )}) will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
