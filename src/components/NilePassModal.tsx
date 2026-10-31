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
  Calendar,
  Clock,
  Download,
  Hash,
  Library,
  MapPin,
  Scan,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Book } from '@/data/books';
import { EASE } from '@/lib/motion';

/* ── Constants ────────────────────────────────────────────────────────────── */
const HOLD_DURATION_MS = 1400;
const RING_RADIUS = 52;

const PICKUP_OPTIONS = [
  'Within 1 hour',
  'Within 3 hours',
  'Same day (before 8 PM)',
  'Next morning (9–12 AM)',
];

/* ── Types ────────────────────────────────────────────────────────────────── */
interface Pass {
  studentId: string;
  code: string;
  pickupWindow: string;
  issuedAt: string;
  validUntil: string;
  shelf: string;
}

function makePassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += '-';
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NUL-${out}`;
}

/* ── Detail row ──────────────────────────────────────────────────────────── */
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
      <div>
        <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-200">{value}</dd>
      </div>
    </div>
  );
}

/* ── Nile University pass card (shown after confirmation) ─────────────────── */
function NilePassCard({ pass, book }: { pass: Pass; book: Book }) {
  const qrPayload = JSON.stringify({
    system: 'NUL',
    code: pass.code,
    student: pass.studentId,
    isbn: book.isbn,
    shelf: pass.shelf,
    issued: pass.issuedAt,
    valid: pass.validUntil,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      className="w-full"
    >
      {/* Confirmed badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
        className="mb-5 flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300"
        role="status"
      >
        <BadgeCheck aria-hidden className="h-4 w-4" />
        Reservation Confirmed
      </motion.div>

      {/* Pass card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
        className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/80 shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)]"
      >
        {/* Card header */}
        <div
          className="relative px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(6,40,80,0.9) 0%, rgba(2,15,42,0.95) 100%)',
          }}
        >
          {/* Nile watermark pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(34,211,238,1) 0px, rgba(34,211,238,1) 1px, transparent 1px, transparent 10px)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">Nile University Library</p>
              <p className="mt-0.5 font-serif text-lg font-semibold text-slate-50">Digital Book Pass</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
              <Library className="h-5 w-5 text-cyan-400" aria-hidden />
            </div>
          </div>
        </div>

        {/* QR + details */}
        <div className="grid sm:grid-cols-[auto_1fr] gap-0">
          {/* QR */}
          <div className="flex flex-col items-center justify-center border-b border-cyan-400/10 p-5 sm:border-b-0 sm:border-r">
            <div className="rounded-xl bg-white p-3 shadow-inner">
              <QRCodeSVG
                value={qrPayload}
                size={130}
                level="M"
                fgColor="#020818"
                bgColor="#ffffff"
              />
            </div>
            <p className="mt-2 font-mono text-sm font-bold tracking-[0.15em] text-cyan-300">
              {pass.code}
            </p>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 p-5 text-sm">
            <div className="flex items-center gap-2 rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2">
              <User className="h-4 w-4 text-cyan-400" aria-hidden />
              <span className="font-mono text-cyan-200">{pass.studentId}</span>
            </div>

            <dl className="space-y-2.5">
              <DetailRow icon={Hash}     label="ISBN"        value={book.isbn} />
              <DetailRow icon={MapPin}   label="Shelf"       value={pass.shelf} />
              <DetailRow icon={Calendar} label="Issued"      value={pass.issuedAt} />
              <DetailRow icon={Clock}    label="Collect by"  value={pass.pickupWindow} />
              <DetailRow icon={BadgeCheck} label="Valid until" value={pass.validUntil} />
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-cyan-400/10 bg-slate-950/60 px-5 py-3">
          <p className="text-[10px] text-slate-600">Show QR at the pickup desk · 14-day loan</p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Save pass"
              className="flex items-center gap-1 rounded-lg border border-slate-700/50 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
            >
              <Download className="h-3 w-3" /> Save
            </button>
            <button
              type="button"
              aria-label="Add to wallet"
              className="flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1.5 text-[11px] text-cyan-400 transition hover:bg-cyan-400/20"
            >
              <Wallet className="h-3 w-3" /> Wallet
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Modal content ────────────────────────────────────────────────────────── */
interface ModalContentProps {
  book: Book;
  onClose: () => void;
  onComplete?: (book: Book) => void;
}

function ModalContent({ book, onClose, onComplete }: ModalContentProps) {
  const progress = useMotionValue(0);
  const ringOpacity = useTransform(progress, [0, 0.01], [0, 1]);
  const ringPercent = useTransform(progress, (v) => `${Math.round(v * 100)}%`);

  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const completedRef = useRef(false);
  const holdingRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [holding, setHolding] = useState(false);
  const [pass, setPass] = useState<Pass | null>(null);
  const [studentId, setStudentId] = useState('');
  const [pickup, setPickup] = useState(PICKUP_OPTIONS[0]);

  /* Lock scroll & Escape key */
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  useEffect(() => () => controlsRef.current?.stop(), []);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    holdingRef.current = false;
    setHolding(false);

    const now = new Date();
    const validUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const fmt = (d: Date) =>
      d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

    setPass({
      studentId,
      code: makePassCode(),
      pickupWindow: pickup,
      issuedAt: fmt(now),
      validUntil: fmt(validUntil),
      shelf: book.location,
    });
    setStep(3);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
    onComplete?.(book);
  }, [book, studentId, pickup, onComplete]);

  const startHold = useCallback(() => {
    if (completedRef.current || holdingRef.current) return;
    holdingRef.current = true;
    controlsRef.current?.stop();
    setHolding(true);

    const remaining = HOLD_DURATION_MS * (1 - progress.get());
    controlsRef.current = animate(progress, 1, {
      duration: remaining / 1000,
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
    controlsRef.current = animate(progress, 0, { duration: 0.45, ease: 'easeOut' });
  }, [progress]);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startHold();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      startHold();
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      endHold();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal shell */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pass-title"
        className="relative w-full max-w-4xl"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="relative max-h-[92vh] overflow-y-auto overscroll-contain rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(34,211,238,0.25)] backdrop-blur-md">

          {/* Top edge accent */}
          <div aria-hidden className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close reservation"
            className="absolute right-4 top-4 z-10 rounded-full border border-slate-700/60 bg-slate-950/60 p-2 text-slate-400 transition hover:border-slate-600 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Step indicator */}
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center gap-2">
              {([1, 2, 3] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                      step === s
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                        : step > s
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                        : 'border-slate-700 text-slate-600'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && <div className={`h-px w-8 ${step > s ? 'bg-emerald-400/40' : 'bg-slate-700/50'}`} />}
                </div>
              ))}
              <p className="ml-3 text-xs text-slate-500">
                {step === 1 ? 'Enter details' : step === 2 ? 'Confirm reservation' : 'Your pass is ready'}
              </p>
            </div>
          </div>

          {/* Body grid */}
          <div className="grid md:grid-cols-[1.1fr_1fr]">

            {/* Left: Book details */}
            <div className="flex flex-col gap-5 p-8 md:border-r md:border-slate-700/40">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400/80">
                Book Reservation
              </p>
              <div>
                <h2 id="pass-title" className="text-2xl leading-tight text-slate-50">
                  {book.title}
                </h2>
                <p className="mt-1.5 text-slate-400">{book.author}</p>
                <p className="text-sm text-slate-600">{book.edition} · {book.faculty}</p>
              </div>

              <dl className="space-y-3.5 border-t border-slate-700/40 pt-5 text-sm">
                <DetailRow icon={Hash}    label="ISBN"            value={book.isbn} />
                <DetailRow icon={Library} label="Shelf Location"  value={book.location} />
                <DetailRow icon={MapPin}  label="Pickup Point"    value={book.pickup} />
                <DetailRow icon={Clock}   label="Loan Period"     value="14 days · collect within 48 hours" />
              </dl>
            </div>

            {/* Right: the ritual */}
            <div className="flex min-h-[28rem] flex-col items-center justify-center p-8">
              <AnimatePresence mode="wait">

                {/* ── Step 1: Input details ─────────────────────────── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    className="w-full space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div>
                      <p className="font-serif text-xl text-slate-100">Enter Your Details</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Required to generate your digital library pass.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="modal-student-id" className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
                        Student ID
                      </label>
                      <input
                        id="modal-student-id"
                        type="text"
                        placeholder="e.g. 200093488"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-base text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="modal-pickup" className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">
                        Pickup Window
                      </label>
                      <select
                        id="modal-pickup"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]"
                      >
                        {PICKUP_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={studentId.trim().length < 4}
                      onClick={() => setStep(2)}
                      className="btn-nile w-full py-3 disabled:opacity-40"
                    >
                      Continue to Confirmation →
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: Hold to confirm ───────────────────────── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-serif text-xl text-slate-100">Confirm Reservation</p>
                    <p className="mt-2 max-w-[220px] text-sm text-slate-500">
                      Press and hold the button for 1.5 s to confirm your reservation.
                    </p>

                    {/* Student recap */}
                    <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm">
                      <span className="text-slate-500">Student:</span>{' '}
                      <span className="font-mono text-cyan-300">{studentId}</span>
                    </div>

                    {/* Hold ring */}
                    <div className="relative mt-8 h-40 w-40">
                      <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 h-full w-full -rotate-90"
                        aria-hidden
                      >
                        <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="rgba(34,211,238,0.12)" strokeWidth="6" />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r={RING_RADIUS}
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="6"
                          strokeLinecap="round"
                          style={{ pathLength: progress, opacity: ringOpacity }}
                        />
                      </svg>

                      <motion.button
                        type="button"
                        aria-label="Hold to confirm reservation"
                        onPointerDown={handlePointerDown}
                        onPointerUp={endHold}
                        onPointerCancel={endHold}
                        onContextMenu={(e) => e.preventDefault()}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onBlur={endHold}
                        animate={{ scale: holding ? 0.93 : 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        className="absolute inset-4 flex touch-none select-none flex-col items-center justify-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/80 text-cyan-200 shadow-[inset_0_0_30px_rgba(34,211,238,0.1)] transition-colors hover:border-cyan-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
                      >
                        <Scan aria-hidden className="h-6 w-6 text-cyan-400" />
                        <span className="px-2 text-center text-[10px] font-medium uppercase leading-tight tracking-[0.18em]">
                          Hold to<br />Confirm
                        </span>
                      </motion.button>
                    </div>

                    <motion.span aria-hidden className="mt-4 font-mono text-xs tracking-widest text-cyan-400/60">
                      {ringPercent}
                    </motion.span>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {/* ── Step 3: Pass generated ────────────────────────── */}
                {step === 3 && pass && (
                  <motion.div
                    key="step3"
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NilePassCard pass={pass} book={book} />

                    <motion.button
                      type="button"
                      onClick={onClose}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                      className="btn-nile mx-auto mt-5 flex"
                    >
                      Done — Close Pass
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom edge accent */}
          <div aria-hidden className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Public wrapper ───────────────────────────────────────────────────────── */
interface NilePassModalProps {
  book: Book | null;
  onClose: () => void;
  onComplete?: (book: Book) => void;
}

export default function NilePassModal({ book, onClose, onComplete }: NilePassModalProps) {
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
