'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, BookOpen, Eye, Filter } from 'lucide-react';
import { BOOKS, type ItemType } from '@/data/books';
import { EASE } from '@/lib/motion';

type StreamFilter = 'all' | ItemType;

const FILTERS: { value: StreamFilter; label: string; icon: React.ElementType }[] = [
  { value: 'all',      label: 'All Items',        icon: Filter },
  { value: 'textbook', label: 'Textbooks',         icon: BookOpen },
  { value: 'research', label: 'Research Papers',   icon: Eye },
  { value: 'capstone', label: 'Student Capstones', icon: BookMarked },
];

const TYPE_COLORS: Record<ItemType, string> = {
  textbook: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400',
  research: 'border-purple-400/30 bg-purple-400/10 text-purple-400',
  capstone: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
};

const TYPE_DOT: Record<ItemType, string> = {
  textbook: 'bg-cyan-400',
  research: 'bg-purple-400',
  capstone: 'bg-amber-400',
};

export default function ResearchStream() {
  const [filter, setFilter] = useState<StreamFilter>('all');

  const items = BOOKS.filter((b) => filter === 'all' || b.itemType === filter);

  return (
    <section
      id="research-stream"
      aria-labelledby="stream-title"
      className="relative px-6 py-28"
    >
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="section-label">Chapter 4 — Discovery Stream</p>
          <h2 id="stream-title" className="section-title">
            Stream of Discovery
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Nile University's top graduation projects, faculty research papers,
            and curated open-access academic collections — all in one stream.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          role="group"
          aria-label="Filter research stream"
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {FILTERS.map(({ value, label, icon: Icon }) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(value)}
                className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
                    : 'border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="stream-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-cyan-400/8"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" aria-hidden />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative mt-14">
          {/* Vertical connector line */}
          <div
            aria-hidden
            className="timeline-line absolute left-6 top-0 bottom-0 w-px"
          />

          <AnimatePresence mode="popLayout">
            <motion.ol className="space-y-6" layout>
              {items.map((book, idx) => (
                <motion.li
                  key={book.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: idx * 0.04, ease: EASE }}
                  className="relative flex gap-6 pl-14"
                >
                  {/* Timeline dot */}
                  <div
                    aria-hidden
                    className={`absolute left-4 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-slate-950 ${TYPE_DOT[book.itemType]}`}
                  />

                  {/* Card */}
                  <div className="group flex-1 rounded-xl border border-slate-700/50 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${TYPE_COLORS[book.itemType]}`}>
                            {book.itemType}
                          </span>
                          <span className="font-mono text-[10px] text-slate-600">{book.year}</span>
                        </div>
                        <h3 className="mt-2 font-serif text-lg leading-snug text-slate-100 group-hover:text-cyan-100 transition-colors duration-300">
                          {book.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">{book.author}</p>
                        {book.abstract && (
                          <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {book.abstract}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">Faculty</p>
                        <p className="mt-0.5 text-xs text-slate-300">{book.faculty}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">ISBN</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-500">{book.isbn}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-700/30 pt-3">
                      <p className="text-[11px] text-slate-600">{book.location}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
                        >
                          <Eye className="h-3 w-3" /> Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
