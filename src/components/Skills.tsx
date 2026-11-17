"use client";

import { m } from "framer-motion";
import { skills } from "@/content";
import { SectionHeading } from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="skills" title="Skills" />

        <div className="divide-y divide-line border-y border-line">
          {skills.map((group) => (
            <m.div
              key={group.group}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
              className="grid gap-4 py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10"
            >
              <m.h3
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                className="font-display text-xl font-bold text-fg"
              >
                {group.group}
              </m.h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <m.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, scale: 0.6, y: 8 },
                      show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 22 } },
                    }}
                    whileHover={{ y: -2 }}
                    className="cursor-default rounded-full border border-line bg-panel px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </m.li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
