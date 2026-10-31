'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  BookMarked,
  BookOpen,
  Eye,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  AVAILABILITY_LABEL,
  BOOKS,
  FACULTIES,
  getAvailability,
  type Availability,
  type Book,
  type Faculty,
  type ItemType,
} from '@/data/books';
import { EASE } from '@/lib/motion';

/* ── Types & constants ────────────────────────────────────────────────────── */
type FacultyFilter = 'All' | Faculty;
const FILTERS: readonly FacultyFilter[] = ['All', ...FACULTIES];

const STATUS_STYLES: Record<Availability, { dot: string; badge: string }> = {
  available:    { dot: 'bg-emerald-400', badge: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
  limited:      { dot: 'bg-amber-400',   badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300' },
  'checked-out':{ dot: 'bg-red-500',     badge: 'border-red-500/30 bg-red-500/10 text-red-400' },
};

const TYPE_ICON: Record<ItemType, React.ElementType> = {
  textbook: BookOpen,
  research: Eye,
  capstone: BookMarked,
};

const TYPE_BADGE: Record<ItemType, string> = {
  textbook: 'border-cyan-400/20 bg-cyan-400/5 text-cyan-400',
  research: 'border-purple-400/20 bg-purple-400/5 text-purple-400',
  capstone: 'border-amber-400/20 bg-amber-400/5 text-amber-400',
};

/* ── Book card ────────────────────────────────────────────────────────────── */
interface BookCardProps {
  book: Book;
  reserved: boolean;
  onReserve: (book: Book) => void;
}

function BookCard({ book, reserved, onReserve }: BookCardProps) {
  const remaining = book.copies - (reserved ? 1 : 0);
  const availability = getAvailability(remaining);
  const status = STATUS_STYLES[availability];
  const unavailable = remaining <= 0 && !reserved;
  const TypeIcon = TYPE_ICON[book.itemType];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]"
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Top row: faculty chip + status */}
      <div className="relative flex items-start justify-between gap-2">
        <span className="rounded-full border border-slate-600/50 bg-slate-800/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          {book.faculty}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${status.badge}`}
          aria-label={`Availability: ${AVAILABILITY_LABEL[availability]}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            {availability !== 'checked-out' && (
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${status.dot}`} />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${status.dot}`} />
          </span>
          {AVAILABILITY_LABEL[availability]}
        </span>
      </div>

      {/* Item type badge */}
      <div className="relative mt-3 flex items-center gap-1.5">
        <TypeIcon className="h-3 w-3 text-slate-500" aria-hidden />
        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${TYPE_BADGE[book.itemType]}`}>
          {book.itemType}
        </span>
        <span className="ml-auto font-mono text-[10px] text-slate-600">{book.year}</span>
      </div>

      {/* Title & author */}
      <h3 className="relative mt-4 text-lg leading-snug text-slate-100 group-hover:text-cyan-100 transition-colors duration-300">
        {book.title}
      </h3>
      <p className="relative mt-1 text-sm text-slate-400">{book.author}</p>
      <p className="relative mt-0.5 text-xs text-slate-600">{book.edition}</p>

      {/* Abstract */}
      {book.abstract && (
        <p className="relative mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {book.abstract}
        </p>
      )}

      {/* Details */}
      <dl className="relative mt-5 space-y-2 border-t border-slate-700/40 pt-4 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Location</dt>
            <dd className="text-slate-300">{book.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Category</dt>
            <dd className="text-slate-300">{book.pinakes}</dd>
          </div>
        </div>
      </dl>

      <p className="relative mt-3 text-[10px] text-slate-600">
        ISBN {book.isbn} · {Math.max(remaining, 0)}/{book.totalCopies} copies
      </p>

      {/* CTAs */}
      <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => onReserve(book)}
          disabled={reserved || unavailable}
          aria-label={reserved ? 'Book already reserved' : `Reserve ${book.title}`}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-300
            ${reserved
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 cursor-not-allowed'
              : unavailable
              ? 'border-slate-700/50 bg-slate-800/30 text-slate-500 cursor-not-allowed'
              : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400/60 hover:shadow-[0_0_16px_-4px_rgba(34,211,238,0.4)]'
            }`}
        >
          {reserved ? (
            <><BadgeCheck className="h-3.5 w-3.5" /> Reserved</>
          ) : unavailable ? (
            'On Loan'
          ) : (
            <><BookMarked className="h-3.5 w-3.5" /> Reserve Book</>
          )}
        </button>

        <button
          type="button"
          aria-label={`Preview digital chapter of ${book.title}`}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700/40 bg-slate-800/30 px-3 py-2.5 text-xs text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
        >
          <Eye className="h-3.5 w-3.5" /> Preview Chapter
        </button>
      </div>
    </motion.article>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
interface NileCatalogProps {
  onReserve: (book: Book) => void;
  reservedIds: readonly string[];
}

export default function NileCatalog({ onReserve, reservedIds }: NileCatalogProps) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState<FacultyFilter>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOOKS.filter((book) => {
      if (faculty !== 'All' && book.faculty !== faculty) return false;
      if (!q) return true;
      return [book.title, book.author, book.faculty, book.location, book.pinakes, book.isbn, book.year.toString()]
        .some((field) => field.toLowerCase().includes(q));
    });
  }, [query, faculty]);

  return (
    <section
      id="catalogue"
      aria-labelledby="catalogue-title"
      className="relative px-6 py-28"
    >
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <p className="section-label">Chapter 3 — Nile Catalog</p>
          <h2 id="catalogue-title" className="section-title">
            Universal Nile Catalog
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Search 45,000+ volumes, capstone projects, and open-access research
            papers. Real-time availability — reserve in seconds.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mx-auto mt-12 max-w-2xl">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400/70"
          />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, shelf, or ISBN…"
            aria-label="Search the Nile catalog"
            className="w-full rounded-full border border-slate-700/60 bg-slate-900/70 py-4 pl-14 pr-12 text-base text-slate-100 outline-none backdrop-blur-md transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.1)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:text-cyan-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Faculty filter pills */}
        <div
          role="group"
          aria-label="Filter by faculty"
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {FILTERS.map((option) => {
            const active = faculty === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setFaculty(option)}
                className={`relative rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  active
                    ? 'border-cyan-400/40 text-cyan-200'
                    : 'border-slate-700/50 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="faculty-pill-nile"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-cyan-400/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <p
          aria-live="polite"
          className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-slate-600"
        >
          {results.length} {results.length === 1 ? 'item' : 'items'} found
        </p>

        {/* Grid */}
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                reserved={reservedIds.includes(book.id)}
                onReserve={onReserve}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-700/50 bg-slate-900/60 p-10 text-center backdrop-blur-md">
            <p className="font-serif text-2xl text-slate-200">No results found.</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different title, author, or clear the faculty filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
