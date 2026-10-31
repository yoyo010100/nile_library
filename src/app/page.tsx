'use client';

import { useCallback, useState } from 'react';
import NileHero from '@/components/NileHero';
import FloorExplorer from '@/components/FloorExplorer';
import NileCatalog from '@/components/NileCatalog';
import ResearchStream from '@/components/ResearchStream';
import ScholarDashboard from '@/components/ScholarDashboard';
import NilePassModal from '@/components/NilePassModal';
import AiAssistant, { NileFooter } from '@/components/AiAssistant';
import type { Book } from '@/data/books';

export default function Home() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [reservedIds, setReservedIds] = useState<string[]>([]);

  const handleReserve = useCallback((book: Book) => setSelected(book), []);
  const handleClose   = useCallback(() => setSelected(null), []);
  const handleComplete = useCallback((book: Book) => {
    setReservedIds((prev) =>
      prev.includes(book.id) ? prev : [...prev, book.id]
    );
  }, []);

  return (
    <main className="relative bg-slate-950">
      {/* ── Ch.1 — Hero ─────────────────────────────────────────────────── */}
      <NileHero />

      {/* ── Ch.2 — Floor Explorer ───────────────────────────────────────── */}
      <FloorExplorer />

      {/* ── Ch.3 — Universal Catalog ────────────────────────────────────── */}
      <NileCatalog onReserve={handleReserve} reservedIds={reservedIds} />

      {/* ── Ch.4 — Research Stream ──────────────────────────────────────── */}
      <ResearchStream />

      {/* ── Ch.5 — Scholar Workbench ────────────────────────────────────── */}
      <ScholarDashboard />

      {/* ── Ch.7 — Footer ───────────────────────────────────────────────── */}
      <NileFooter />

      {/* ── Ch.6 — Digital Pass Modal (portal) ──────────────────────────── */}
      <NilePassModal
        book={selected}
        onClose={handleClose}
        onComplete={handleComplete}
      />

      {/* ── Ch.7 — Floating AI Assistant ────────────────────────────────── */}
      <AiAssistant />
    </main>
  );
}
