'use client';

import { useRef, type CSSProperties } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ChevronDown, Compass } from 'lucide-react';
import { EASE } from '@/lib/motion';

const MOTES = [
  { left: '8%', top: '24%', size: 3, delay: 0, duration: 9 },
  { left: '17%', top: '62%', size: 2, delay: 1.5, duration: 11 },
  { left: '26%', top: '38%', size: 4, delay: 3, duration: 8 },
  { left: '34%', top: '74%', size: 2, delay: 0.8, duration: 12 },
  { left: '47%', top: '18%', size: 3, delay: 2.2, duration: 10 },
  { left: '58%', top: '68%', size: 2, delay: 4, duration: 9 },
  { left: '66%', top: '30%', size: 4, delay: 1, duration: 13 },
  { left: '75%', top: '56%', size: 3, delay: 2.8, duration: 8 },
  { left: '84%', top: '22%', size: 2, delay: 3.6, duration: 11 },
  { left: '91%', top: '70%', size: 3, delay: 0.4, duration: 10 },
] as const;

/** Column heights (in vh) — deterministic so server and client markup match. */
const COLUMNS = Array.from({ length: 9 }, (_, i) => 34 + ((i * 7) % 4) * 5);

const BACKGROUND_GRADIENT =
  'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(180,83,9,0.5) 0%, rgba(120,53,15,0.28) 28%, rgba(41,37,36,0.6) 55%, #0c0a09 85%)';

const GRID_STYLE: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(251,191,36,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.07) 1px, transparent 1px), linear-gradient(rgba(251,191,36,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.035) 1px, transparent 1px)',
  backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
  maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
  WebkitMaskImage:
    'radial-gradient(ellipse at center, black 25%, transparent 72%)',
};

const COLUMNS_MASK: CSSProperties = {
  maskImage: 'linear-gradient(to top, black 10%, transparent 95%)',
  WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 95%)',
};

export default function HeroParallax() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Background layers drift at different speeds for depth.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const columnsY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Content layer.
  const badgeY = useTransform(scrollYProgress, [0, 0.5], [0, -140]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const titleOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.8], [0, -160]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const veilOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-stone-950">
        {/* Background: amber-to-stone radial gradient */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -inset-y-[12%]"
          style={{ y: bgY, background: BACKGROUND_GRADIENT }}
        />

        {/* Glowing orb behind the title */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-[42%] h-[60vmin] w-[60vmin] rounded-full bg-amber-500/10 blur-3xl"
          style={{ x: '-50%', y: '-50%', scale: glowScale }}
        />

        {/* Background: blueprint grid */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -inset-y-[12%]"
          style={{ ...GRID_STYLE, y: gridY }}
        />

        {/* Fluted colonnade silhouette */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-[4vw] opacity-40"
          style={{ ...COLUMNS_MASK, y: columnsY }}
        >
          {COLUMNS.map((height, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ height: `${height}vh` }}
            >
              <div className="h-2 w-14 rounded-sm bg-amber-500/30" />
              <div className="h-1 w-11 bg-amber-500/20" />
              <div
                className="w-9 flex-1"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(251,191,36,0.16) 0px, rgba(251,191,36,0.16) 2px, transparent 2px, transparent 6px)',
                }}
              />
              <div className="h-1 w-11 bg-amber-500/20" />
              <div className="h-2 w-14 rounded-sm bg-amber-500/30" />
            </div>
          ))}
        </motion.div>

        {/* Drifting dust motes */}
        {!reduceMotion &&
          MOTES.map((mote, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full bg-amber-300/60"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
              }}
              animate={{ y: [0, -40, 0], opacity: [0.15, 0.7, 0.15] }}
              transition={{
                duration: mote.duration,
                delay: mote.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        {/* Content layer */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div
              style={{ y: badgeY, opacity: badgeOpacity }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-amber-500/20 bg-stone-900/60 px-5 py-2 backdrop-blur-md"
            >
              <motion.span
                aria-hidden
                className="inline-flex text-amber-400"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
              >
                <Compass className="h-4 w-4" />
              </motion.span>
              <span className="text-xs uppercase tracking-[0.3em] text-amber-200/90">
                285 BC — Alexandria, Egypt
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
          >
            <motion.h1
              style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
              className="bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text pb-2 text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-[0.9] tracking-tight text-transparent"
            >
              The Mouseion
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
          >
            <motion.p
              style={{ y: subtitleY, opacity: subtitleOpacity }}
              className="mt-8 max-w-2xl font-serif text-xl italic leading-relaxed text-amber-100/80 md:text-2xl"
            >
              Twenty-three centuries ago, scribes copied every scroll that
              entered Alexandria&apos;s harbour. Today the same devotion carries
              each manuscript into the digital age — catalogued, vaulted, and
              reserved with a single royal seal.
            </motion.p>
          </motion.div>
        </div>

        {/* Pulsing scroll indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-amber-300/80"
            animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[11px] uppercase tracking-[0.35em]">
              Scroll to Descend
            </span>
            <motion.span
              aria-hidden
              animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Fades the hero into the next section */}
        <motion.div
          aria-hidden
          style={{ opacity: veilOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/60 to-stone-950"
        />
      </div>
    </section>
  );
}
