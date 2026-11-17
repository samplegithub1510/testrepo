"use client";

import { m, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/** Fades and slides its children in when they enter the viewport, staggered. */
export function Reveal({
  children,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  amount?: number;
}) {
  const Comp = as === "ul" ? m.ul : as === "ol" ? m.ol : m.div;
  return (
    <Comp className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" | "p" }) {
  const Comp = as === "li" ? m.li : as === "p" ? m.p : m.div;
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}

/** Section title block used by every section. */
export function SectionHeading({ id, title, lede }: { id: string; title: string; lede?: string }) {
  return (
    <Reveal className="mb-12 max-w-3xl sm:mb-16">
      <m.h2 id={`${id}-title`} variants={fadeUp} className="font-display text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[0.95] text-fg">
        {title}
      </m.h2>
      {lede && (
        <m.p variants={fadeUp} className="mt-5 max-w-[60ch] text-lg text-muted">
          {lede}
        </m.p>
      )}
    </Reveal>
  );
}
