'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, type Variants } from 'framer-motion';
import {
  Cog,
  Cpu,
  Landmark,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { EASE } from '@/lib/motion';

interface Vault {
  id: string;
  name: string;
  epithet: string;
  manuscripts: number;
  blurb: string;
  icon: LucideIcon;
}

const VAULTS: readonly Vault[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    epithet: "The Calculators' Urn",
    manuscripts: 1240,
    blurb: 'Algorithms, systems and the logic of machines.',
    icon: Cpu,
  },
  {
    id: 'eng',
    name: 'Engineering',
    epithet: "The Architects' Urn",
    manuscripts: 980,
    blurb: 'Mechanics, materials and the craft of building.',
    icon: Cog,
  },
  {
    id: 'med',
    name: 'Medicine',
    epithet: "The Physicians' Urn",
    manuscripts: 1560,
    blurb: 'Anatomy, physiology and the art of healing.',
    icon: Stethoscope,
  },
  {
    id: 'phil',
    name: 'Philosophy',
    epithet: "The Sages' Urn",
    manuscripts: 2115,
    blurb: 'Ethics, logic and the long conversation of ideas.',
    icon: Landmark,
  },
];

const TOTAL_MANUSCRIPTS = VAULTS.reduce((sum, v) => sum + v.manuscripts, 0);

const cardVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.04,
    y: -8,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
};

const glowVariants: Variants = {
  rest: { opacity: 0, scale: 0.85 },
  hover: { opacity: 1, scale: 1.1, transition: { duration: 0.4 } },
};

const urnVariants: Variants = {
  rest: { rotate: 0, y: 0 },
  hover: { rotate: [0, -3, 3, 0], y: -4, transition: { duration: 0.7 } },
};

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;

    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (value) => {
        node.textContent = Math.round(value).toLocaleString('en-US');
      },
    });

    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>0</span>;
}

function Urn() {
  return (
    <svg
      viewBox="0 0 80 100"
      className="h-24 w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* lip and neck */}
      <path d="M30 10h20" />
      <path d="M33 10C33 22 31 26 26 32" />
      <path d="M47 10C47 22 49 26 54 32" />
      {/* handles */}
      <path d="M33 14C20 14 18 26 24 34" />
      <path d="M47 14C60 14 62 26 56 34" />
      {/* body */}
      <path d="M26 32C12 44 12 68 28 82L32 90H48L52 82C68 68 68 44 54 32" />
      {/* base */}
      <path d="M32 90v4h16v-4" />
      {/* decorative bands */}
      <path d="M17 52H63" />
      <path d="M16.5 60H63.5" />
      <path d="M22 56l4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3" strokeOpacity="0.6" />
    </svg>
  );
}

export default function ScrollVault() {
  return (
    <section
      id="vaults"
      aria-labelledby="vaults-title"
      className="relative px-6 py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400/80">
            The Scroll Vaults
          </p>
          <h2
            id="vaults-title"
            className="mt-4 text-4xl text-amber-50 md:text-6xl"
          >
            Four Urns, One Library
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            Each faculty keeps its manuscripts in a vault of its own — over{' '}
            <span className="text-amber-300">
              <CountUp to={TOTAL_MANUSCRIPTS} />
            </span>{' '}
            works in all, ready to be called up from the stacks.
          </p>
        </div>

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VAULTS.map((vault, index) => {
            const Icon = vault.icon;
            return (
              <motion.li
                key={vault.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
              >
                <motion.div
                  variants={cardVariants}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  className="group relative h-full"
                >
                  {/* Glowing backdrop */}
                  <motion.div
                    variants={glowVariants}
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.35),transparent_70%)] blur-2xl"
                  />

                  <div className="relative flex h-full flex-col items-center rounded-2xl border border-amber-500/20 bg-stone-900/60 p-8 text-center backdrop-blur-md transition-colors duration-300 group-hover:border-amber-500/50">
                    <motion.div
                      variants={urnVariants}
                      className="text-amber-400"
                    >
                      <Urn />
                    </motion.div>

                    <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-stone-950/60 text-amber-300">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>

                    <h3 className="mt-4 text-2xl text-amber-50">{vault.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-amber-400/70">
                      {vault.epithet}
                    </p>
                    <p className="mt-4 text-sm text-stone-400">{vault.blurb}</p>

                    <p className="mt-6 border-t border-amber-500/10 pt-4 font-serif text-xl text-amber-200">
                      {vault.manuscripts.toLocaleString('en-US')} Manuscripts
                    </p>
                  </div>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
