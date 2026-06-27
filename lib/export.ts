import { CATEGORIES } from "./categories";
import type { CategoryId, Expense } from "./types";
import { expensesToCsv } from "./utils";

export interface ExportFilters {
  startDate: string;
  endDate: string;
  categories: CategoryId[];
}

export function filterExpenses(
  expenses: Expense[],
  filters: ExportFilters
): Expense[] {
  return expenses
    .filter((e) => {
      if (filters.startDate && e.date < filters.startDate) return false;
      if (filters.endDate && e.date > filters.endDate) return false;
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(e.category)
      )
        return false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function downloadBlob(
  filename: string,
  content: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsCsv(expenses: Expense[], filename: string): void {
  downloadBlob(`${filename}.csv`, expensesToCsv(expenses), "text/csv;charset=utf-8;");
}

export function exportAsJson(expenses: Expense[], filename: string): void {
  const data = expenses.map((e) => ({
    date: e.date,
    category: CATEGORIES[e.category].label,
    amount: e.amount,
    description: e.description,
  }));
  downloadBlob(
    `${filename}.json`,
    JSON.stringify(data, null, 2),
    "application/json"
  );
}

export function exportAsPdf(expenses: Expense[], filename: string): void {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const rows = expenses
    .map(
      (e) => `
        <tr>
          <td>${e.date}</td>
          <td>${CATEGORIES[e.category].label}</td>
          <td class="num">$${e.amount.toFixed(2)}</td>
          <td>${e.description.replace(/</g, "&lt;")}</td>
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 40px; color: #0f172a; font-size: 13px; }
    h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .meta { color: #64748b; margin: 0 0 28px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 9px 12px; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; }
    tfoot td { font-weight: 700; border-top: 2px solid #e2e8f0; border-bottom: none; padding-top: 12px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Expense Report</h1>
  <p class="meta">${filename} &nbsp;·&nbsp; ${expenses.length} records &nbsp;·&nbsp; Total: $${total.toFixed(2)}</p>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th style="text-align:right">Amount</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2">Total</td>
        <td class="num">$${total.toFixed(2)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
}
