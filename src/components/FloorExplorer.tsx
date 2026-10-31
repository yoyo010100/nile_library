'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  BookOpen,
  FlaskConical,
  Check,
  Clock,
  Users,
  Wifi,
} from 'lucide-react';
import { EASE } from '@/lib/motion';

/* ── Floor data ──────────────────────────────────────────────────────────── */
interface FloorInfo {
  id: number;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  podRows: number;
  podCols: number;
  occupiedPods: number[];
}

const FLOORS: FloorInfo[] = [
  {
    id: 1,
    name: 'Floor 1',
    subtitle: 'Collaborative Innovation Hub & Coffee Lounge',
    icon: Coffee,
    color: 'amber',
    features: ['Group study tables', 'Maker space', 'Espresso bar', 'Lounge seating', 'Whiteboards'],
    podRows: 3,
    podCols: 6,
    occupiedPods: [1, 4, 7, 9, 12, 15, 17],
  },
  {
    id: 2,
    name: 'Floor 2',
    subtitle: 'Main Academic Catalog & Silent Study Pods',
    icon: BookOpen,
    color: 'cyan',
    features: ['Silent study pods', 'Main stacks', 'Reference desk', 'Print services', 'Manuscript room'],
    podRows: 4,
    podCols: 7,
    occupiedPods: [0, 2, 5, 8, 11, 14, 18, 20, 22, 25],
  },
  {
    id: 3,
    name: 'Floor 3',
    subtitle: 'Postgraduate Research Archives & E-Resource Lab',
    icon: FlaskConical,
    color: 'emerald',
    features: ['PhD carrels', 'e-Resource terminals', 'Thesis archives', 'IEEE/Springer access', 'Seminar rooms'],
    podRows: 3,
    podCols: 5,
    occupiedPods: [2, 6, 10, 12],
  },
];

/* ── Pod booking state ───────────────────────────────────────────────────── */
interface Booking {
  podIndex: number;
  floorId: number;
  studentId: string;
  time: string;
}

const colorMap: Record<string, Record<string, string>> = {
  amber: {
    badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(251,191,36,0.4)]',
    ring: 'ring-amber-400/40',
    dot: 'bg-amber-400',
  },
  cyan: {
    badge: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.4)]',
    ring: 'ring-cyan-400/40',
    dot: 'bg-cyan-400',
  },
  emerald: {
    badge: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    glow: 'hover:shadow-[0_0_30px_-8px_rgba(52,211,153,0.4)]',
    ring: 'ring-emerald-400/40',
    dot: 'bg-emerald-400',
  },
};

export default function FloorExplorer() {
  const [activeFloor, setActiveFloor] = useState(1);
  const [selectedPod, setSelectedPod] = useState<number | null>(null);
  const [studentId, setStudentId] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);

  const floor = FLOORS.find((f) => f.id === activeFloor)!;
  const totalPods = floor.podRows * floor.podCols;
  const c = colorMap[floor.color];

  const handleBook = () => {
    if (selectedPod === null || studentId.trim() === '') return;
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    setBooking({
      podIndex: selectedPod,
      floorId: activeFloor,
      studentId: studentId.trim(),
      time: `${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
    });
  };

  const handleReset = () => {
    setBooking(null);
    setSelectedPod(null);
    setStudentId('');
  };

  return (
    <section
      id="floors"
      aria-labelledby="floors-title"
      className="relative px-6 py-28"
    >
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <p className="section-label">Chapter 2 — Physical Halls</p>
          <h2 id="floors-title" className="section-title">
            Explore the Nile Library Floors
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Three floors, each tuned to a different mode of scholarship. Click any
            available study pod to reserve a 2-hour quiet session.
          </p>
        </div>

        {/* Floor tabs */}
        <div
          role="tablist"
          aria-label="Library floors"
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {FLOORS.map((f) => {
            const Icon = f.icon;
            const active = activeFloor === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                aria-controls={`floor-panel-${f.id}`}
                id={`floor-tab-${f.id}`}
                onClick={() => {
                  setActiveFloor(f.id);
                  setSelectedPod(null);
                  setBooking(null);
                }}
                className={`relative flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? `${colorMap[f.color].badge} ${colorMap[f.color].glow}`
                    : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="floor-pill"
                    aria-hidden
                    className={`absolute inset-0 rounded-xl opacity-20 ${f.color === 'amber' ? 'bg-amber-400' : f.color === 'cyan' ? 'bg-cyan-400' : 'bg-emerald-400'}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative h-4 w-4" aria-hidden />
                <span className="relative">{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Floor panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFloor}
            id={`floor-panel-${activeFloor}`}
            role="tabpanel"
            aria-labelledby={`floor-tab-${activeFloor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]"
          >
            {/* Pod grid */}
            <div className="glass-panel p-6 md:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl text-slate-100">{floor.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{floor.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-600" /> Occupied
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${floor.podCols}, 1fr)` }}
                role="grid"
                aria-label={`Study pod grid for ${floor.name}`}
              >
                {Array.from({ length: totalPods }, (_, i) => {
                  const isOccupied = floor.occupiedPods.includes(i);
                  const isSelected = selectedPod === i;
                  const isBooked = booking?.podIndex === i && booking.floorId === activeFloor;

                  if (isBooked) {
                    return (
                      <div
                        key={i}
                        role="gridcell"
                        className="aspect-square rounded-lg border border-cyan-400/60 bg-cyan-400/20 text-cyan-300 ring-2 ring-cyan-400/30 flex items-center justify-center"
                        aria-label={`Pod ${i + 1}: Your reservation`}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                    );
                  }

                  if (isOccupied) {
                    return (
                      <div
                        key={i}
                        role="gridcell"
                        aria-label={`Pod ${i + 1}: Occupied`}
                        className="pod-occupied aspect-square rounded-lg border flex items-center justify-center"
                      >
                        <Users className="h-2.5 w-2.5 opacity-50" />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={i}
                      role="gridcell"
                      type="button"
                      aria-label={`Pod ${i + 1}: Available – click to select`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedPod(isSelected ? null : i)}
                      className={`pod-available aspect-square rounded-lg border transition-all duration-200 ${
                        isSelected ? 'pod-selected' : ''
                      }`}
                    />
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                {totalPods - floor.occupiedPods.length} of {totalPods} pods available ·{' '}
                {floor.podRows} rows × {floor.podCols} columns
              </p>
            </div>

            {/* Booking panel */}
            <div className="glass-panel flex flex-col gap-5 p-6">
              <h3 className="text-lg text-slate-100">Reserve a Study Pod</h3>

              <AnimatePresence mode="wait">
                {booking ? (
                  <motion.div
                    key="confirmed"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Booking Confirmed!</span>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-300">
                        <p>
                          <span className="text-slate-500">Pod:</span> #{booking.podIndex + 1} · {floor.name}
                        </p>
                        <p>
                          <span className="text-slate-500">Student ID:</span> {booking.studentId}
                        </p>
                        <p>
                          <span className="text-slate-500">Session:</span> {booking.time}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-nile w-full"
                    >
                      Book Another Pod
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    {/* Features */}
                    <ul className="space-y-1.5">
                      {floor.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <hr className="border-slate-700/50" />

                    {/* Selected pod */}
                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3 text-sm">
                      {selectedPod !== null ? (
                        <p className="text-slate-200">
                          Selected:{' '}
                          <span className="font-medium text-cyan-300">
                            Pod #{selectedPod + 1}
                          </span>
                          <span className="ml-2 text-slate-400">· 2-hour session</span>
                        </p>
                      ) : (
                        <p className="text-slate-500">Select an available pod from the grid →</p>
                      )}
                    </div>

                    {/* Student ID */}
                    <div>
                      <label htmlFor="student-id" className="mb-1 block text-xs uppercase tracking-wider text-slate-500">
                        Student ID
                      </label>
                      <input
                        id="student-id"
                        type="text"
                        placeholder="e.g. 200093488"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-lg border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]"
                      />
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4 text-cyan-400" aria-hidden />
                      <span>2-hour quiet study session</span>
                    </div>

                    <button
                      type="button"
                      disabled={selectedPod === null || studentId.trim() === ''}
                      onClick={handleBook}
                      className="btn-nile w-full mt-2"
                    >
                      <Check className="h-4 w-4" />
                      Confirm Reservation
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Wifi className="h-3 w-3" />
                      Wi-Fi credentials sent to your student email on booking
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
