# The Mouseion

A cinematic university library site inspired by the Great Library of Alexandria (285 BC), with a textbook reservation ritual.

## Stack

Next.js 15 (App Router, TypeScript) · Tailwind CSS 3 · Lenis · Framer Motion · lucide-react · qrcode.react

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TypeScript check
npm run build      # production build
```

## Structure

```
src/
  app/
    layout.tsx          Fonts (Cormorant Garamond + Inter), dark theme, SmoothScroll wrapper
    page.tsx            Landing page + modal/reservation state
    globals.css         Tailwind + Lenis base styles
  components/
    SmoothScroll.tsx    Lenis inertia scrolling (duration 1.2, expo-out easing, rAF cleanup)
    HeroParallax.tsx    250vh sticky hero with scroll-driven parallax
    ScrollVault.tsx     Faculty urns with hover glow and manuscript counts
    BookSearch.tsx      Glass search bar, faculty pills, textbook cards
    WaxSealModal.tsx    Hold-to-stamp reservation ritual with QR pickup pass
  data/books.ts         Mock dataset (6 textbooks)
  lib/motion.ts         Shared easing curve
```

## Notes

- `qrcode.react` is the one dependency beyond the requested stack. It renders a real, scannable QR code.
- The QR payload is `MOUSEION|<reservation code>|<ISBN>`; wire it to your pickup-desk scanner or backend.
- Books, ISBNs and availability are mock data in `src/data/books.ts`. Replace the ISBNs with real values before using them.
- Reservations live in client state only; reserving a book decrements its displayed copies for the session.
- `prefers-reduced-motion` is respected: Lenis is skipped and the looping hero animations are disabled.
- While the modal is open, the page scroll is locked and the dialog carries `data-lenis-prevent` so it can scroll natively on small screens.
