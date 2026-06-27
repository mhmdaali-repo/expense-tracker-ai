"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadExpenses, saveExpenses } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { Expense, ExpenseInput } from "@/lib/types";

interface ExpenseContextValue {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (input: ExpenseInput) => void;
  updateExpense: (id: string, input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
  clearAll: () => void;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage after mount (client only).
  useEffect(() => {
    setExpenses(loadExpenses());
    setIsLoading(false);
  }, []);

  // Persist whenever expenses change (skip the initial loading phase).
  useEffect(() => {
    if (!isLoading) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback((input: ExpenseInput) => {
    const expense: Expense = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, input: ExpenseInput) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...input } : e))
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => setExpenses([]), []);

  const value = useMemo<ExpenseContextValue>(
    () => ({
      expenses,
      isLoading,
      addExpense,
      updateExpense,
      deleteExpense,
      clearAll,
    }),
    [expenses, isLoading, addExpense, updateExpense, deleteExpense, clearAll]
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses(): ExpenseContextValue {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
