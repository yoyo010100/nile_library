'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';
import {
  BadgeCheck,
  Clock,
  Hash,
  Library,
  MapPin,
  Stamp,
  X,
  type LucideIcon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Book } from '@/data/books';
import { EASE } from '@/lib/motion';

const HOLD_DURATION_MS = 1500;
const RING_RADIUS = 54;

const PAPYRUS_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(251,191,36,0.045) 0px, rgba(251,191,36,0.045) 1px, transparent 1px, transparent 6px), linear-gradient(180deg, rgba(180,83,9,0.12), rgba(28,25,23,0) 40%, rgba(120,53,15,0.14))',
} as const;

/** Irregular, wax-like outline — deterministic so SSR and client agree. */
function buildSealPath(): string {
  const points = 48;
  let d = '';
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = 52 + Math.sin(i * 2.7) * 2.2 + Math.cos(i * 5.1) * 1.6;
    const x = 60 + Math.cos(angle) * radius;
    const y = 60 + Math.sin(angle) * radius;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

const SEAL_PATH = buildSealPath();

interface Pass {
  code: string;
  validUntil: string;
}

function makeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MSN-${out}`;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <div>
        <dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
          {label}
        </dt>
        <dd className="text-stone-200">{value}</dd>
      </div>
    </div>
  );
}

function WaxSeal() {
  return (
    <motion.div
      className="relative h-24 w-24"
      initial={{ scale: 2.4, opacity: 0, rotate: -24, y: -30 }}
      animate={{ scale: 1, opacity: 1, rotate: -8, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 14, mass: 0.9 }}
    >
      {/* impact ripple */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-wax"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
      />
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full drop-shadow-[0_8px_16px_rgba(139,0,0,0.55)]"
        role="img"
        aria-label="Royal wax seal"
      >
        <defs>
          <radialGradient id="wax-fill" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#c2301f" />
            <stop offset="55%" stopColor="#8b0000" />
            <stop offset="100%" stopColor="#4a0000" />
          </radialGradient>
        </defs>
        <path d={SEAL_PATH} fill="url(#wax-fill)" />
        <circle
          cx="60"
          cy="60"
          r="38"
          fill="none"
          stroke="#3b0000"
          strokeOpacity="0.55"
          strokeWidth="2.5"
        />
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="#e8a090"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <text
          x="60"
          y="76"
          textAnchor="middle"
          fontSize="48"
          fontWeight="700"
          fontFamily="Georgia, 'Times New Roman', serif"
          fill="#3b0000"
          fillOpacity="0.8"
        >
          {'Μ'}
        </text>
      </svg>
    </motion.div>
  );
}

interface ModalContentProps {
  book: Book;
  onClose: () => void;
  onComplete?: (book: Book) => void;
}

function ModalContent({ book, onClose, onComplete }: ModalContentProps) {
  const progress = useMotionValue(0);
  const ringOpacity = useTransform(progress, [0, 0.01], [0, 1]);
  const percent = useTransform(progress, (v) => `${Math.round(v * 100)}%`);

  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const completedRef = useRef(false);
  const holdingRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [holding, setHolding] = useState(false);
  const [pass, setPass] = useState<Pass | null>(null);

  // Lock page scroll, focus the dialog and wire up Escape.
  useEffect(() => {
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  useEffect(() => () => controlsRef.current?.stop(), []);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    holdingRef.current = false;
    setHolding(false);

    const validUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
    setPass({
      code: makeCode(),
      validUntil: validUntil.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    });

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([25, 40, 25]);
    }
    onComplete?.(book);
  }, [book, onComplete]);

  const startHold = useCallback(() => {
    if (completedRef.current || holdingRef.current) return;
    holdingRef.current = true;
    controlsRef.current?.stop();
    setHolding(true);

    const remainingMs = HOLD_DURATION_MS * (1 - progress.get());
    controlsRef.current = animate(progress, 1, {
      duration: remainingMs / 1000,
      ease: 'linear',
      onComplete: () => {
        if (progress.get() >= 0.999) finish();
      },
    });
  }, [finish, progress]);

  const endHold = useCallback(() => {
    if (completedRef.current || !holdingRef.current) return;
    holdingRef.current = false;
    controlsRef.current?.stop();
    setHolding(false);
    controlsRef.current = animate(progress, 0, {
      duration: 0.45,
      ease: 'easeOut',
    });
  }, [progress]);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    startHold();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      event.preventDefault();
      startHold();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      endHold();
    }
  };

  const stamped = pass !== null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="seal-title"
        className="relative w-full max-w-4xl rounded-2xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(245,158,11,0.4)]"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* The papyrus unrolls from its centre line */}
        <motion.div
          className="relative max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl border border-amber-500/20 bg-stone-900/60 backdrop-blur-md"
          initial={{ clipPath: 'inset(46% 0% 46% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {/* rolled top edge */}
          <div
            aria-hidden
            className="h-3 bg-gradient-to-b from-amber-800/70 via-amber-400/30 to-amber-900/50"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close reservation"
            className="absolute right-4 top-6 z-10 rounded-full border border-amber-500/20 bg-stone-950/60 p-2 text-stone-300 transition hover:border-amber-500/50 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className="grid md:grid-cols-[1.1fr_1fr]"
            style={PAPYRUS_STYLE}
          >
            {/* Left: textbook details */}
            <div className="flex flex-col gap-6 p-8 md:border-r md:border-dashed md:border-amber-500/20">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-400/80">
                Reservation Scroll
              </p>
              <div>
                <h2
                  id="seal-title"
                  className="text-3xl leading-tight text-amber-50"
                >
                  {book.title}
                </h2>
                <p className="mt-2 text-stone-300">{book.author}</p>
                <p className="text-sm text-stone-500">
                  {book.edition} · {book.faculty}
                </p>
              </div>

              <dl className="space-y-4 border-t border-amber-500/10 pt-6 text-sm">
                <DetailRow icon={Hash} label="ISBN" value={book.isbn} />
                <DetailRow icon={Library} label="Ancient Vault" value={book.vault} />
                <DetailRow
                  icon={MapPin}
                  label="Campus Pickup"
                  value={book.pickup}
                />
                <DetailRow
                  icon={Clock}
                  label="Loan Terms"
                  value="14-day loan · collect within 48 hours"
                />
              </dl>
            </div>

            {/* Right: the ritual */}
            <div className="flex min-h-[26rem] flex-col items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {!stamped ? (
                  <motion.div
                    key="hold"
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-serif text-2xl text-amber-100">
                      Seal your reservation
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-stone-400">
                      Press and hold the seal for 1.5 seconds to bind your
                      request in wax.
                    </p>

                    <div className="relative mt-8 h-40 w-40">
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 h-full w-full -rotate-90"
                        aria-hidden
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r={RING_RADIUS}
                          fill="none"
                          stroke="rgba(245,158,11,0.18)"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r={RING_RADIUS}
                          fill="none"
                          stroke="#8b0000"
                          strokeWidth="6"
                          strokeLinecap="round"
                          style={{ pathLength: progress, opacity: ringOpacity }}
                        />
                      </svg>

                      <motion.button
                        type="button"
                        aria-label="Hold to stamp royal seal"
                        onPointerDown={handlePointerDown}
                        onPointerUp={endHold}
                        onPointerCancel={endHold}
                        onContextMenu={(event) => event.preventDefault()}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onBlur={endHold}
                        animate={{ scale: holding ? 0.94 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        className="absolute inset-4 flex touch-none select-none flex-col items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-stone-950/70 text-amber-100 shadow-[inset_0_0_30px_rgba(139,0,0,0.35)] transition-colors hover:border-amber-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
                      >
                        <Stamp aria-hidden className="h-6 w-6 text-amber-400" />
                        <span className="px-3 text-center text-[11px] font-medium uppercase leading-tight tracking-[0.18em]">
                          Hold to Stamp
                          <br />
                          Royal Seal
                        </span>
                      </motion.button>
                    </div>

                    <motion.span
                      aria-hidden
                      className="mt-4 font-mono text-xs tracking-widest text-wax-light"
                    >
                      {percent}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    className="flex w-full flex-col items-center text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WaxSeal />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300"
                      role="status"
                    >
                      <BadgeCheck aria-hidden className="h-4 w-4" />
                      Scroll reserved
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
                      animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                      transition={{ delay: 0.9, duration: 0.7, ease: EASE }}
                      className="mt-5 w-full max-w-[15rem] rounded-xl border border-amber-500/30 bg-stone-950/50 p-4"
                    >
                      <div className="mx-auto w-fit rounded-lg bg-white p-3">
                        <QRCodeSVG
                          value={`MOUSEION|${pass.code}|${book.isbn}`}
                          size={140}
                          level="M"
                          fgColor="#1c1917"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p className="mt-3 font-mono text-sm tracking-widest text-amber-300">
                        {pass.code}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        Show at the pickup desk · valid until {pass.validUntil}
                      </p>
                    </motion.div>

                    <motion.button
                      type="button"
                      onClick={onClose}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.4 }}
                      className="mt-5 rounded-lg border border-amber-500/30 px-5 py-2 text-sm text-amber-100 transition hover:border-amber-500/60 hover:bg-amber-400/10"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* rolled bottom edge */}
          <div
            aria-hidden
            className="h-3 bg-gradient-to-t from-amber-800/70 via-amber-400/30 to-amber-900/50"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface WaxSealModalProps {
  book: Book | null;
  onClose: () => void;
  onComplete?: (book: Book) => void;
}

export default function WaxSealModal({
  book,
  onClose,
  onComplete,
}: WaxSealModalProps) {
  return (
    <AnimatePresence>
      {book ? (
        <ModalContent
          key={book.id}
          book={book}
          onClose={onClose}
          onComplete={onComplete}
        />
      ) : null}
    </AnimatePresence>
  );
}
