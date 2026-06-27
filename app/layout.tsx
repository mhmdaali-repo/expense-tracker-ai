import type { Metadata } from "next";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { ToastProvider } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Expensa — Personal Expense Tracker",
  description:
    "A modern expense tracking app to manage your personal finances with summaries, filters, and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <ExpenseProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {children}
              </main>
              <footer className="border-t border-slate-200 bg-white py-6">
                <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
                  Expensa · Your data is stored locally in your browser.
                </div>
              </footer>
            </div>
          </ExpenseProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
