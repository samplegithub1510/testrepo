"use client";

import { m } from "framer-motion";
import { impact, stats } from "@/content";
import Counter from "./Counter";
import { fadeUp, Reveal } from "./Reveal";

export default function Impact() {
  return (
    <section id="impact" aria-labelledby="impact-title" className="relative border-y border-line bg-bg-2 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <m.h2
          id="impact-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 font-display text-3xl font-extrabold text-fg sm:text-4xl"
        >
          {impact.title}
        </m.h2>

        <Reveal as="ul" amount={0.15} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-4">
          {stats.map((s) => (
            <m.li key={s.id} variants={fadeUp} className="relative pl-4 sm:pl-5">
              <m.span
                aria-hidden="true"
                className="absolute left-0 top-1 bottom-1 w-px origin-top bg-accent"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
              <Counter stat={s} className="block font-mono text-[clamp(1.45rem,3.2vw,2.6rem)] font-semibold leading-none text-fg" />
              <span className="mt-3 block max-w-[24ch] text-[0.95rem] leading-snug text-muted">{s.label}</span>
            </m.li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
