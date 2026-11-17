"use client";

import { AnimatePresence, m, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Demo } from "@/content";
import { useMotionPref } from "./useMotionPref";

/**
 * A short, illustrative demo of how a project works, shown after Results in
 * each case study. Three formats, all scripted in content.ts:
 *  - chat:     a conversation plays out, with tags for which agent/tool acted
 *  - terminal: a run log types out line by line
 *  - pipeline: sample items move through stages and land on an outcome
 * Plays once when scrolled into view; Replay restarts it. Reduced motion
 * shows the finished state straight away.
 */

const toneClass: Record<string, string> = {
  ok: "text-accent",
  warn: "text-warn",
  err: "text-[var(--dg-threat)]",
  muted: "text-muted",
  cmd: "text-fg",
};

function useTicker(total: number, run: number, playing: boolean, stepMs: number, instant: boolean) {
  const [shown, setShown] = useState(instant ? total : 0);
  useEffect(() => {
    if (instant) {
      setShown(total);
      return;
    }
    if (!playing) return;
    setShown(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= total) window.clearInterval(id);
    }, stepMs);
    return () => window.clearInterval(id);
  }, [total, run, playing, stepMs, instant]);
  return shown;
}

function Chat({ demo, shown }: { demo: Extract<Demo, { kind: "chat" }>; shown: number }) {
  const steps = demo.steps.slice(0, shown);
  const next = demo.steps[shown];
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {steps.map((s, i) => {
          if (s.role === "system" || s.role === "tool") {
            return (
              <m.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <span
                  className={`inline-flex max-w-full items-start gap-2 rounded-2xl border px-3 py-1 text-left font-mono text-[0.72rem] ${
                    s.status === "err"
                      ? "border-[var(--dg-threat)]/40 text-[var(--dg-threat)]"
                      : s.status === "warn"
                        ? "border-warn/40 text-warn"
                        : "border-line text-muted"
                  }`}
                >
                  {s.role === "tool" && <span className="text-accent">⚙</span>}
                  <span className="break-words">{s.text}</span>
                  {s.status === "ok" && <span className="text-accent">✓</span>}
                </span>
              </m.div>
            );
          }
          const mine = s.role === "user";
          return (
            <m.div key={i} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${mine ? "text-right" : ""}`}>
                {s.name && <p className={`mb-1 text-[0.7rem] font-semibold ${mine ? "text-muted" : "text-accent"}`}>{s.name}</p>}
                <p className={`inline-block rounded-2xl px-3.5 py-2 text-left text-sm leading-snug ${mine ? "rounded-br-md bg-accent text-accent-ink" : "rounded-bl-md border border-line bg-panel text-fg"}`}>
                  {s.text}
                </p>
              </div>
            </m.div>
          );
        })}
      </AnimatePresence>
      {next && next.role === "agent" && shown > 0 && (
        <div className="flex items-center gap-1 pl-1" aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <m.span key={d} className="h-1.5 w-1.5 rounded-full bg-muted" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
          ))}
        </div>
      )}
    </div>
  );
}

function Terminal({ demo, shown }: { demo: Extract<Demo, { kind: "terminal" }>; shown: number }) {
  return (
    <div className="font-mono text-[0.78rem] leading-relaxed">
      {demo.lines.slice(0, shown).map((l, i) => (
        <m.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`${toneClass[l.tone ?? "muted"]} whitespace-pre-wrap break-words`}>
          {l.tone === "cmd" ? <span className="text-accent">$ </span> : null}
          {l.text}
        </m.p>
      ))}
      {shown < demo.lines.length && <span className="caret inline-block h-[1em] w-[7px] translate-y-[0.15em] bg-accent/80" aria-hidden="true" />}
    </div>
  );
}

const outcomeStyle = {
  ok: { text: "Passed", cls: "border-accent/50 text-accent" },
  review: { text: "To review", cls: "border-warn/50 text-warn" },
  blocked: { text: "Blocked", cls: "border-[var(--dg-threat)]/50 text-[var(--dg-threat)]" },
};

function Pipeline({ demo, tick, instant }: { demo: Extract<Demo, { kind: "pipeline" }>; tick: number; instant: boolean }) {
  const n = demo.stages.length;
  // each item starts 2 ticks after the previous one and moves one stage per tick
  const posOf = (k: number) => (instant ? demo.items[k].stops : Math.min(demo.items[k].stops, tick - k * 2));
  return (
    <div>
      <div className="grid gap-1 text-[0.7rem] font-semibold text-muted" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {demo.stages.map((st) => (
          <div key={st} className="truncate border-b border-line pb-2 text-center">
            {st}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-3">
        {demo.items.map((it, k) => {
          const pos = posOf(k);
          const started = pos >= 0;
          const done = started && pos >= it.stops;
          const o = outcomeStyle[it.outcome];
          return (
            <div key={it.label}>
              <div className="relative h-9 rounded-full bg-[var(--dg-pipe)]">
                {/* progress trail */}
                <m.div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent/15"
                  animate={{ width: started ? `${((Math.max(pos, 0) + 1) / n) * 100}%` : "0%" }}
                  transition={{ duration: instant ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
                <m.div
                  className="absolute top-1/2 -translate-y-1/2 px-1"
                  style={{ width: `${100 / n}%` }}
                  initial={false}
                  animate={{ left: `${(Math.max(pos, 0) / n) * 100}%`, opacity: started ? 1 : 0 }}
                  transition={{ duration: instant ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className={`block truncate rounded-full border bg-panel px-2.5 py-1 text-center text-[0.72rem] font-medium ${
                      done ? o.cls : "border-line text-fg"
                    }`}
                  >
                    {it.label}
                  </span>
                </m.div>
              </div>
              <AnimatePresence>
                {done && (
                  <m.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 pl-2 text-xs text-muted">
                    <span className={`mr-2 rounded-full border px-2 py-px font-semibold ${o.cls}`}>{o.text}</span>
                    <span className="mr-1 font-semibold text-fg sm:hidden">{it.label}:</span>
                    {it.note}
                  </m.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DemoPlayer({ demo, root }: { demo: Demo; root: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMotionPref();
  const inView = useInView(ref, { root, once: true, amount: 0.35 });
  const [run, setRun] = useState(0);

  const total =
    demo.kind === "chat"
      ? demo.steps.length
      : demo.kind === "terminal"
        ? demo.lines.length
        : Math.max(...demo.items.map((it, k) => it.stops + k * 2)) + 1;
  const stepMs = demo.kind === "chat" ? 1100 : demo.kind === "terminal" ? 520 : 650;
  const shown = useTicker(total, run, inView, stepMs, reduce);
  const finished = shown >= total;

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-line bg-[var(--dg-bg)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className={`h-2.5 w-2.5 rounded-full ${finished ? "bg-accent" : "animate-pulse bg-warn"}`} />
        </span>
        <span className="truncate font-mono text-xs text-fg">{demo.title}</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={!finished}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
          </svg>
          Replay
        </button>
      </div>
      <div className="min-h-[12rem] p-4 sm:p-5" aria-live="off">
        {demo.kind === "chat" && <Chat demo={demo} shown={shown} />}
        {demo.kind === "terminal" && <Terminal demo={demo} shown={shown} />}
        {demo.kind === "pipeline" && <Pipeline demo={demo} tick={shown - 1} instant={reduce} />}
      </div>
      <p className="border-t border-line px-4 py-2 text-[0.7rem] text-muted">Illustrative demo with sample data. It shows how the system behaves, not real client data.</p>
    </div>
  );
}
