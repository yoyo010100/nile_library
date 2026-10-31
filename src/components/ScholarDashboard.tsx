'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  RefreshCw,
  RotateCcw,
  BookMarked,
  AlertCircle,
} from 'lucide-react';
import { EASE } from '@/lib/motion';

/* ── Mock student data ────────────────────────────────────────────────────── */
interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  location: string;
  dueDate: Date;
  coverColor: string;
}

const INITIAL_LOANS: BorrowedBook[] = [
  {
    id: 'loan-1',
    title: 'Algorithms & Data Structures in C++',
    author: 'Cormen, Leiserson, Rivest & Stein',
    location: 'Main Library • Floor 2 • CS-104',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    coverColor: 'from-cyan-600 to-cyan-800',
  },
  {
    id: 'loan-2',
    title: 'Renewable Energy Systems in Egypt',
    author: 'Dr. Maged Nour & Dr. Sara Khalil',
    location: 'Main Library • Floor 2 • EN-201',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    coverColor: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'loan-3',
    title: 'Corporate Governance in Emerging Markets',
    author: 'Claessens & Yurtoglu',
    location: 'Main Library • Floor 2 • BA-310',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day — urgent
    coverColor: 'from-amber-600 to-amber-800',
  },
];

const SAVED_LIST = [
  'Machine Learning for Medical Diagnostics',
  'CRISPR-Based Biosensors for Nile Water Quality',
  'Database Systems Architecture',
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Loan card ────────────────────────────────────────────────────────────── */
function LoanCard({ loan, onRenew, renewed }: { loan: BorrowedBook; onRenew: (id: string) => void; renewed: boolean }) {
  const days = daysUntil(loan.dueDate);
  const urgent = days <= 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`group rounded-xl border bg-slate-900/60 backdrop-blur-md transition-all duration-300 overflow-hidden ${
        urgent
          ? 'border-amber-400/40 hover:border-amber-400/60'
          : 'border-slate-700/50 hover:border-cyan-400/20'
      }`}
    >
      <div className="flex">
        {/* Book spine accent */}
        <div className={`w-2 shrink-0 bg-gradient-to-b ${loan.coverColor}`} />

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="truncate text-sm font-medium text-slate-100 group-hover:text-cyan-100 transition-colors">
                {loan.title}
              </h4>
              <p className="mt-0.5 truncate text-xs text-slate-500">{loan.author}</p>
            </div>

            {urgent && !renewed && (
              <span className="shrink-0 flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-400">
                <AlertCircle className="h-3 w-3" /> Due soon
              </span>
            )}
            {renewed && (
              <span className="shrink-0 flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-400">
                ✓ Renewed
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3 w-3 text-cyan-400" aria-hidden />
              <span>
                Due {formatDate(loan.dueDate)}{' '}
                <span className={urgent && !renewed ? 'text-amber-400 font-medium' : 'text-slate-600'}>
                  ({renewed ? '14 days extended' : `${days} day${days !== 1 ? 's' : ''} left`})
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => onRenew(loan.id)}
              disabled={renewed}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] transition-all duration-200 ${
                renewed
                  ? 'border-slate-700/30 text-slate-600 cursor-not-allowed'
                  : 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/60'
              }`}
            >
              <RefreshCw className="h-3 w-3" />
              {renewed ? 'Renewed' : 'Renew Loan'}
            </button>
          </div>

          <p className="text-[10px] text-slate-700">{loan.location}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function ScholarDashboard() {
  const [renewedIds, setRenewedIds] = useState<string[]>([]);

  const handleRenew = (id: string) => {
    setRenewedIds((prev) => [...prev, id]);
  };

  const handleRenewAll = () => {
    setRenewedIds(INITIAL_LOANS.map((l) => l.id));
  };

  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-title"
      className="relative px-6 py-28"
    >
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 20% 60%, rgba(34,211,238,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="section-label">Chapter 5 — Scholar's Workbench</p>
          <h2 id="dashboard-title" className="section-title">
            Your Active Borrowings
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Track your current loans, renew before they expire, and manage your
            personal reading list — all in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Active loans */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg text-slate-100">
                <BookOpen className="h-5 w-5 text-cyan-400" aria-hidden />
                Active Loans ({INITIAL_LOANS.length})
              </h3>
              <button
                type="button"
                onClick={handleRenewAll}
                disabled={renewedIds.length === INITIAL_LOANS.length}
                className="btn-nile text-xs px-3 py-2 disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Renew All
              </button>
            </div>

            <div className="space-y-3">
              {INITIAL_LOANS.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onRenew={handleRenew}
                  renewed={renewedIds.includes(loan.id)}
                />
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Active Loans', value: INITIAL_LOANS.length, color: 'text-cyan-300' },
                { label: 'Renewed', value: renewedIds.length, color: 'text-emerald-300' },
                { label: 'Due Soon', value: INITIAL_LOANS.filter((l) => daysUntil(l.dueDate) <= 3).length, color: 'text-amber-300' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-panel p-4 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Saved reading list */}
          <div className="glass-panel p-6">
            <h3 className="flex items-center gap-2 text-lg text-slate-100">
              <BookMarked className="h-5 w-5 text-amber-400" aria-hidden />
              Saved Reading List
            </h3>
            <p className="mt-1 text-xs text-slate-500">{SAVED_LIST.length} titles saved</p>

            <ul className="mt-5 space-y-3">
              {SAVED_LIST.map((title, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                  className="flex items-start gap-3 rounded-lg border border-slate-700/40 bg-slate-800/40 px-4 py-3 text-sm text-slate-300"
                >
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" aria-hidden />
                  <span className="leading-snug">{title}</span>
                </motion.li>
              ))}
            </ul>

            <button
              type="button"
              className="btn-gold mt-5 w-full text-xs"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Browse Catalog to Add More
            </button>

            <hr className="my-5 border-slate-700/40" />

            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-cyan-400/70" />
                Standard loan period: 14 days · Renewals: up to 2×
              </p>
              <p className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400/70" />
                Late fee: EGP 2/day after due date
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
