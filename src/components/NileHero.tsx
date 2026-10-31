'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { BookOpen, ChevronDown, Wifi, Users, Volume2 } from 'lucide-react';
import { EASE } from '@/lib/motion';

/* ── Ambient particles (deterministic positions for SSR safety) ─────────── */
const PARTICLES = [
  { left: '6%',  top: '20%', size: 2, delay: 0,   dur: 11, color: 'bg-cyan-400/50' },
  { left: '14%', top: '65%', size: 3, delay: 1.8, dur: 9,  color: 'bg-cyan-300/40' },
  { left: '23%', top: '40%', size: 2, delay: 3.2, dur: 13, color: 'bg-emerald-400/40' },
  { left: '35%', top: '78%', size: 2, delay: 0.6, dur: 10, color: 'bg-cyan-400/30' },
  { left: '48%', top: '15%', size: 4, delay: 2.5, dur: 12, color: 'bg-amber-400/30' },
  { left: '55%', top: '70%', size: 2, delay: 4.1, dur: 8,  color: 'bg-cyan-300/50' },
  { left: '67%', top: '35%', size: 3, delay: 1.2, dur: 14, color: 'bg-emerald-300/35' },
  { left: '77%', top: '55%', size: 2, delay: 3.0, dur: 9,  color: 'bg-cyan-400/45' },
  { left: '86%', top: '25%', size: 3, delay: 0.9, dur: 11, color: 'bg-amber-300/35' },
  { left: '93%', top: '72%', size: 2, delay: 2.0, dur: 10, color: 'bg-cyan-400/40' },
] as const;

/* ── Live status bar metrics ─────────────────────────────────────────────── */
const STATUS_ITEMS = [
  { label: 'Nile University Library', highlight: true },
  { label: 'Open 24/7 Study Hall', highlight: false },
  { label: 'Occupancy: 62%', highlight: false },
  { label: 'Quiet Level: 88%', highlight: false },
  { label: 'Wi-Fi: 1.2 Gbps', highlight: false },
] as const;

/* ── Hero metrics bar ────────────────────────────────────────────────────── */
const METRICS = [
  { value: '45,000+', label: 'Printed Volumes', icon: BookOpen },
  { value: '120,000+', label: 'Digital Journals', icon: Wifi },
  { value: '24/7', label: 'Research Hub', icon: Users },
  { value: '88%', label: 'Quiet Level', icon: Volume2 },
] as const;

export default function NileHero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Parallax transforms
  const bgY       = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const wave1Y    = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const wave2Y    = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  // Content transforms
  const statusY       = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const statusOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const titleY        = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const titleOpacity  = useTransform(scrollYProgress, [0.4, 0.8], [1, 0]);
  const subtitleY     = useTransform(scrollYProgress, [0, 0.8], [0, -180]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const metricsY      = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const metricsOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const veilOpacity   = useTransform(scrollYProgress, [0.6, 1], [0, 1]);

  return (
    <section ref={ref} aria-label="Nile University Library Hero" className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: '#020818' }}>

        {/* ── Deep background radial gradient ─────────────────────────────── */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -inset-y-[15%]"
          style={{
            y: bgY,
            background: 'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(6,40,80,0.9) 0%, rgba(2,15,42,0.8) 40%, #020818 80%)',
          }}
        />

        {/* ── Cyan teal glow orb ───────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] rounded-full blur-3xl"
          style={{
            x: '-50%',
            y: '-50%',
            scale: glowScale,
            background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
          }}
        />

        {/* ── Secondary amber glow ─────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          className="absolute right-[15%] top-[25%] h-[30vmin] w-[30vmin] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          }}
        />

        {/* ── Grid overlay ─────────────────────────────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px),
              linear-gradient(rgba(34,211,238,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 25px 25px, 25px 25px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />

        {/* ── Nile wave layers ─────────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%]"
          style={{ y: wave1Y }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave-grad-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.15)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0.04)" />
              </linearGradient>
            </defs>
            <path
              d="M0,160 C360,240 720,80 1080,160 C1260,200 1380,140 1440,160 L1440,320 L0,320 Z"
              fill="url(#wave-grad-1)"
            />
          </svg>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[25%]"
          style={{ y: wave2Y }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wave-grad-2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(52,211,153,0.08)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.03)" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 C480,120 960,280 1440,180 L1440,320 L0,320 Z"
              fill="url(#wave-grad-2)"
            />
          </svg>
        </motion.div>

        {/* ── Ambient particles ────────────────────────────────────────────── */}
        {!reduceMotion &&
          PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden
              className={`absolute rounded-full ${p.color}`}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: p.dur,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* ── Live status banner ───────────────────────────────────────────── */}
        <motion.div
          style={{ y: statusY, opacity: statusOpacity }}
          className="absolute left-0 right-0 top-0 z-20 overflow-hidden border-b border-cyan-400/10 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-0 whitespace-nowrap px-4 py-2">
            <div className="flex animate-[marquee_30s_linear_infinite] items-center gap-8">
              {[...STATUS_ITEMS, ...STATUS_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-2 text-xs ${
                    item.highlight ? 'font-semibold text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {item.highlight && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    </span>
                  )}
                  {item.label}
                  <span className="text-slate-700">•</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="nile-badge mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Nile University · Est. 2007 · 6th of October City, Egypt
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          >
            <motion.h1
              style={{ y: titleY, opacity: titleOpacity }}
              className="text-[clamp(3rem,12vw,9rem)] font-semibold leading-[0.88] tracking-tight"
            >
              <span className="gradient-text-nile">Where</span>
              <br />
              <span className="text-slate-50">Knowledge</span>
              <br />
              <span className="gradient-text-gold">Flows.</span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          >
            <motion.p
              style={{ y: subtitleY, opacity: subtitleOpacity }}
              className="mx-auto mt-8 max-w-2xl font-serif text-xl italic leading-relaxed text-slate-300/90 md:text-2xl"
            >
              Like the Nile that has nourished civilisations for millennia, our library
              channels the stream of human knowledge — catalogued, preserved, and
              ready to flow into every scholar's hands.
            </motion.p>
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            style={{ y: metricsY, opacity: metricsOpacity }}
            className="mt-14 flex flex-wrap justify-center gap-3 sm:gap-5"
          >
            {METRICS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="glass-panel flex items-center gap-3 px-5 py-3"
              >
                <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
                <div className="text-left">
                  <p className="font-mono text-lg font-bold text-cyan-300 leading-none">{value}</p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-cyan-400/70"
            animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[11px] uppercase tracking-[0.35em]">Explore the Library</span>
            <motion.span
              aria-hidden
              animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </motion.div>
        </motion.div>

        {/* ── Section veil ─────────────────────────────────────────────────── */}
        <motion.div
          aria-hidden
          style={{ opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950"
        />
      </div>

      {/* ── Inline marquee keyframe ───────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
