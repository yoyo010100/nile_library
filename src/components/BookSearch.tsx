'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, MapPin, ScrollText, Search, X } from 'lucide-react';
import {
  AVAILABILITY_LABEL,
  BOOKS,
  FACULTIES,
  getAvailability,
  type Availability,
  type Book,
  type Faculty,
} from '@/data/books';
import { EASE } from '@/lib/motion';

type FacultyFilter = 'All' | Faculty;

const FILTERS: readonly FacultyFilter[] = ['All', ...FACULTIES];

const STATUS_STYLES: Record<Availability, { dot: string; text: string }> = {
  available: { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  limited: { dot: 'bg-amber-400', text: 'text-amber-300' },
  'checked-out': { dot: 'bg-red-500', text: 'text-red-400' },
};

interface BookSearchProps {
  onReserve: (book: Book) => void;
  /** Ids of books the visitor has already reserved this session. */
  reservedIds: readonly string[];
}

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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-stone-900/60 p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-amber-500/50 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="rounded-full border border-amber-500/20 bg-stone-950/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
          {book.faculty}
        </span>
        <span
          className={`inline-flex items-center gap-2 text-xs ${status.text}`}
          aria-label={`Availability: ${AVAILABILITY_LABEL[availability]}`}
        >
          <span className="relative flex h-2 w-2">
            {availability !== 'checked-out' && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${status.dot}`}
              />
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`}
            />
          </span>
          {AVAILABILITY_LABEL[availability]}
        </span>
      </div>

      <h3 className="relative mt-6 text-2xl leading-snug text-amber-50">
        {book.title}
      </h3>
      <p className="relative mt-1 text-sm text-stone-400">{book.author}</p>

      <dl className="relative mt-6 space-y-3 border-t border-amber-500/10 pt-5 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
              Ancient Vault
            </dt>
            <dd className="text-stone-200">{book.vault}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
              Pinakes Heading
            </dt>
            <dd className="text-stone-200">{book.pinakes}</dd>
          </div>
        </div>
      </dl>

      <p className="relative mt-5 text-xs text-stone-500">
        {Math.max(remaining, 0)} of {book.totalCopies} copies on the shelf
      </p>

      <button
        type="button"
        onClick={() => onReserve(book)}
        disabled={reserved || unavailable}
        className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-wax px-4 py-3 text-sm font-medium tracking-wide text-amber-50 transition duration-300 hover:bg-wax-light hover:shadow-[0_0_24px_-4px_rgba(139,0,0,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-wax disabled:hover:shadow-none"
      >
        {reserved ? (
          <>
            <BadgeCheck className="h-4 w-4" /> Scroll Reserved
          </>
        ) : unavailable ? (
          'All Scrolls Borrowed'
        ) : (
          <>
            <ScrollText className="h-4 w-4" /> Reserve Scroll
          </>
        )}
      </button>
    </motion.article>
  );
}

export default function BookSearch({ onReserve, reservedIds }: BookSearchProps) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState<FacultyFilter>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOOKS.filter((book) => {
      if (faculty !== 'All' && book.faculty !== faculty) return false;
      if (!q) return true;
      return [
        book.title,
        book.author,
        book.faculty,
        book.vault,
        book.pinakes,
        book.isbn,
      ].some((field) => field.toLowerCase().includes(q));
    });
  }, [query, faculty]);

  return (
    <section
      id="catalogue"
      aria-labelledby="catalogue-title"
      className="relative px-6 py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400/80">
            The Catalogue
          </p>
          <h2
            id="catalogue-title"
            className="mt-4 text-4xl text-amber-50 md:text-6xl"
          >
            Search the Stacks
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            Every textbook is catalogued after Callimachus&apos; Pinakes and kept
            in its own vault. Find yours, then reserve it with a seal.
          </p>
        </div>

        {/* Glassmorphism search bar */}
        <div className="relative mx-auto mt-12 max-w-2xl">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/80"
          />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, author, vault or ISBN…"
            aria-label="Search textbooks"
            className="w-full rounded-full border border-amber-500/20 bg-stone-900/60 py-4 pl-14 pr-12 text-base text-stone-100 outline-none backdrop-blur-md transition placeholder:text-stone-500 focus:border-amber-500/60 focus:shadow-[0_0_0_4px_rgba(245,158,11,0.12)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 transition hover:text-amber-300"
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
                className={`relative rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-amber-500/50 text-amber-100'
                    : 'border-amber-500/15 text-stone-400 hover:border-amber-500/30 hover:text-amber-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="faculty-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-amber-400/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{option}</span>
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-stone-500"
        >
          {results.length} {results.length === 1 ? 'scroll' : 'scrolls'} found
        </p>

        <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-stone-900/60 p-10 text-center backdrop-blur-md">
            <p className="font-serif text-2xl text-amber-100">
              No scroll answers that call.
            </p>
            <p className="mt-2 text-sm text-stone-400">
              Try another title, or clear the faculty filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
