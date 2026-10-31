'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Bot,
  ChevronDown,
  MapPin,
  Search,
  Send,
  X,
} from 'lucide-react';
import { EASE } from '@/lib/motion';

/* ── Mock responses ───────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const QUICK_PROMPTS = [
  'Where is the Algorithms book?',
  'How do I renew a loan?',
  'What time does the library close?',
  'Are there silent study pods available?',
];

function botReply(q: string): string {
  const query = q.toLowerCase();

  if (query.includes('algorithm') || query.includes('cs-104'))
    return '📚 "Algorithms & Data Structures in C++" is located at **Main Library · Floor 2 · Shelf CS-104**. 4 copies are currently available. You can reserve it directly from the catalog above!';

  if (query.includes('renew'))
    return '🔄 To renew a loan, visit your **Scholar\'s Workbench** section on this page and click the "Renew Loan" button next to the book. You can renew up to 2 times per item. If the book is requested by another student, renewal may be blocked.';

  if (query.includes('close') || query.includes('hours') || query.includes('open'))
    return '🕐 Nile University Library is open **24/7** for the 24/7 Study Hall (Floors 1 & 2). The Reference & Research Desk (Floor 3) is staffed **Sun–Thu: 8 AM – 10 PM**, Fri–Sat: 10 AM – 6 PM.';

  if (query.includes('pod') || query.includes('study') || query.includes('seat'))
    return '🪑 You can check pod availability in the **Floor Explorer** section. Floor 2 currently has the most silent pods. Click any green pod to reserve a 2-hour session — just bring your student ID!';

  if (query.includes('wifi') || query.includes('wi-fi') || query.includes('internet'))
    return '📶 The library offers **1.2 Gbps symmetric Wi-Fi** throughout all floors. Connect to **NUL-Academic** with your student credentials (same as your email login).';

  if (query.includes('thesis') || query.includes('capstone') || query.includes('graduate'))
    return '🎓 Nile University capstone theses and postgraduate research are archived on **Floor 3 — Postgraduate Research Archives**. You can also browse them in the Research Stream section. Digital copies are accessible through the E-Resource Lab terminals.';

  if (query.includes('print') || query.includes('photocopy') || query.includes('scan'))
    return '🖨️ Print, scan, and photocopy services are available on **Floor 2** near the information desk. Rates: Printing EGP 0.5/page B&W, EGP 2/page colour. Scanning is free for students.';

  if (query.includes('return') || query.includes('drop'))
    return '📦 Book return drop boxes are located: (1) Main entrance lobby — 24/7, (2) Floor 1 coffee lounge — 24/7, (3) Engineering building C lobby — staffed hours. No late fee if returned by midnight on the due date.';

  return `🤖 I found some results for "${q}". For precise answers, please visit the information desk on Floor 2 or call ext. 3344. I\'m here to help with general library questions, catalog navigation, and booking guidance!`;
}

/* ── Floating trigger button ──────────────────────────────────────────────── */
function FloatingButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close AI library assistant' : 'Open AI library assistant'}
      aria-expanded={open}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-slate-900/90 px-4 py-3 text-sm font-medium text-cyan-300 shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)] backdrop-blur-md transition-all duration-300 hover:bg-slate-800/90 hover:border-cyan-400/60"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Bot className="h-5 w-5 text-cyan-400" aria-hidden />
      <span className="hidden sm:inline">Ask Nile Lib Bot</span>
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <ChevronDown className="h-4 w-4" aria-hidden />
      </motion.span>

      {/* Live indicator */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
    </motion.button>
  );
}

/* ── Chat drawer ──────────────────────────────────────────────────────────── */
function ChatDrawer({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: '👋 Hello! I\'m **Nile Lib Bot**, your AI library assistant. I can help you find books, check availability, navigate floors, renew loans, and more. What do you need?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply: Message = { id: `b-${Date.now()}`, role: 'bot', text: botReply(text) };
      setMessages((p) => [...p, reply]);
      setLoading(false);
    }, 700 + Math.random() * 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed bottom-20 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-900/95 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.8),0_0_40px_-15px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:w-[380px]"
      style={{ maxHeight: 'min(520px, calc(100vh - 140px))' }}
      data-lenis-prevent
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
            <Bot className="h-4 w-4 text-cyan-400" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-100">Nile Lib Bot</p>
            <p className="text-[10px] text-emerald-400">● Online</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-full p-1.5 text-slate-500 transition hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-400/20 border border-cyan-400/20 text-cyan-100'
                  : 'bg-slate-800/70 border border-slate-700/50 text-slate-200'
              }`}
              // Simple bold markdown support
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>'),
              }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/70 px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cyan-400/60"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="border-t border-slate-700/40 px-4 py-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-600">Quick questions</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-[11px] text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-700/50 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about books, floors, loans…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/40"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 transition hover:bg-cyan-400/20 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function AiAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingButton onClick={() => setOpen((o) => !o)} open={open} />
      <AnimatePresence>{open && <ChatDrawer onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* ── Quick links footer section (exported separately) ────────────────────── */
export function NileFooter() {
  const QUICK_LINKS = [
    { icon: MapPin,   label: 'Book Return Drop Boxes',   detail: 'Main Lobby · Floor 1 · Eng. Building C' },
    { icon: Search,   label: 'Inter-Library Loan (ILL)',  detail: 'Request via Floor 3 desk · 3–7 business days' },
    { icon: BookOpen, label: 'Library Hours',             detail: 'Study Hall 24/7 · Reference Desk Sun–Thu 8 AM–10 PM' },
  ];

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950">
      {/* Quick links bar */}
      <div className="border-b border-slate-800/40 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.35em] text-slate-600">
            Library Services
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {QUICK_LINKS.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="glass-panel flex items-start gap-4 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/8">
                  <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-8 text-center">
        <p className="gradient-text-nile font-serif text-2xl font-semibold">
          Nile University Library
        </p>
        <p className="mt-1.5 text-sm text-slate-600">
          6th of October City, Giza, Egypt · Est. 2007 · Where Knowledge Flows
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-slate-700">
          <span>+20 (0)38 54 7000</span>
          <span>library@nu.edu.eg</span>
          <span>© {new Date().getFullYear()} Nile University</span>
        </div>
      </div>
    </footer>
  );
}
