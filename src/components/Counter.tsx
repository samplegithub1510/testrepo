"use client";

import { animate, useInView } from "framer-motion";
import { useMotionPref } from "./useMotionPref";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/content";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** The exact text of a stat, e.g. "$25,000+" or "~85% → ~92%". */
export function statText(s: Stat) {
  return `${s.lead ?? ""}${s.prefix ?? ""}${fmt(s.value)}${s.suffix ?? ""}`;
}

/** Counts a stat up from zero the first time it scrolls into view. */
export default function Counter({ stat, className }: { stat: Stat; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useMotionPref();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(stat.value);
      return;
    }
    // Ranges like ~85% → ~92% count from the starting value, not zero.
    const from = stat.lead ? parseFloat(stat.lead.replace(/[^\d.]/g, "")) || 0 : 0;
    const controls = animate(from, stat.value, {
      duration: stat.value > 1000 ? 1.8 : 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setN,
    });
    return () => controls.stop();
  }, [inView, reduce, stat]);

  const final = fmt(stat.value);
  return (
    <span ref={ref} className={className}>
      {/* Screen readers always get the final, exact number */}
      <span className="sr-only">{statText(stat)}</span>
      <span aria-hidden="true" className="tabular inline-flex items-baseline whitespace-nowrap">
        {stat.lead && <span className="mr-[0.15em] text-[0.6em] text-muted">{stat.lead}</span>}
        {stat.prefix}
        {/* reserve the final width so the layout never jumps while counting */}
        <span className="relative inline-block">
          <span className="invisible">{final}</span>
          <span className="absolute inset-0 text-right">{fmt(n)}</span>
        </span>
        {stat.suffix}
      </span>
    </span>
  );
}
