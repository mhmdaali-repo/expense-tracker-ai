# Expensa — Personal Expense Tracker

A modern, responsive expense tracking web app built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Track your spending, filter and search expenses, visualize trends with charts, and export to CSV. All data is stored locally in your browser via `localStorage` — no backend required.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

---

## Features

- **Dashboard** — summary cards (total, this month, top category, average), a category breakdown donut chart, and a 6-month spending trend bar chart.
- **Add / Edit / Delete expenses** — with a clean modal form and confirmation on delete.
- **Form validation** — required fields, positive amounts, no future dates, length limits, with inline error messages.
- **Search & filter** — by description text, category, and a date range; see a live filtered total.
- **Categories** — Food, Transportation, Entertainment, Shopping, Bills, Other (each color-coded with an icon).
- **CSV export** — download the current (filtered) list of expenses.
- **Currency & date formatting** — via the `Intl` API.
- **Visual feedback** — toast notifications, loading skeletons, empty states, and hover interactions.
- **Responsive** — works on desktop and mobile.
- **Local persistence** — expenses are saved to `localStorage` automatically.

## Tech Stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 14 (App Router)                  |
| Language       | TypeScript                               |
| Styling        | Tailwind CSS                             |
| Charts         | Recharts                                 |
| Icons          | lucide-react                             |
| State          | React hooks + Context (`ExpenseContext`) |
| Persistence    | Browser `localStorage`                   |

## Getting Started

### Prerequisites

- Node.js 18.17+ (tested on Node 22)

### Install & run (development)

```bash
cd expense-tracker-ai
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### Production build

```bash
npm run build
npm run start
```

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── layout.tsx          # Root layout: providers, navbar, footer
│   ├── globals.css         # Tailwind layers + component classes
│   ├── page.tsx            # Dashboard (summaries + charts + recent)
│   └── expenses/page.tsx   # Expenses list, filters, CRUD, export
├── components/
│   ├── Navbar.tsx          # Top navigation
│   ├── SummaryCards.tsx    # Dashboard stat cards
│   ├── CategoryPieChart.tsx
│   ├── MonthlyBarChart.tsx
│   ├── ExpenseForm.tsx     # Validated add/edit form
│   ├── ExpenseList.tsx     # List rows with edit/delete
│   ├── FilterBar.tsx       # Search + category + date range
│   ├── CategoryBadge.tsx   # Category chips / icon tiles
│   ├── Modal.tsx           # Accessible modal dialog
│   ├── ConfirmDialog.tsx   # Delete confirmation
│   ├── Toast.tsx           # Toast notification system
│   ├── EmptyState.tsx      # Empty / no-results states
│   └── Skeleton.tsx        # Loading skeletons
├── context/
│   └── ExpenseContext.tsx  # Global expense state + persistence
├── lib/
│   ├── types.ts            # Shared types
│   ├── categories.ts       # Category metadata, colors, icons
│   ├── analytics.ts        # Summary / chart aggregations
│   ├── storage.ts          # localStorage read/write + validation
│   └── utils.ts            # Currency/date formatting, CSV, ids
└── ...config files
```

## How to Test Each Feature

1. **Add an expense** — Click **Add Expense** (on the Dashboard or Expenses page). Fill in amount, category, date, and description, then submit. A toast confirms success and the dashboard updates.
2. **Validation** — Try submitting with an empty amount, a `0`/negative amount, an empty description, or a future date — inline errors appear and submission is blocked.
3. **Dashboard analytics** — After adding a few expenses across categories and months, the summary cards, donut chart, category breakdown, and monthly bar chart populate.
4. **Search & filter** — On the **Expenses** page, type in the search box, pick a category, and/or set a `From`/`To` date range. The list and the filtered total update live. Click the **✕** to clear filters.
5. **Edit** — Hover a row and click the pencil icon. The form opens pre-filled; save your changes.
6. **Delete** — Hover a row and click the trash icon. Confirm in the dialog; the expense is removed.
7. **Export CSV** — Click **Export CSV** on the Expenses page to download the currently filtered expenses as a `.csv` file (opens in Excel/Sheets).
8. **Persistence** — Refresh the page; your expenses remain (stored in `localStorage`). To reset, clear the site's local storage in your browser dev tools.
9. **Responsive** — Resize the window or open dev tools device mode; the layout adapts for mobile.

## Notes

- This demo intentionally uses `localStorage` for persistence, so data is per-browser and not synced across devices.
- A system font stack is used (no external font fetch) so the app builds and runs fully offline.
