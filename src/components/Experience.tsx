"use client";

import { m, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/content";
import { fadeUp, Reveal, SectionHeading } from "./Reveal";

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="experience" title="Experience" />

        <ol ref={ref} className="relative ml-2 sm:ml-4">
          {/* the track, and the line that draws itself as you scroll */}
          <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-px bg-line" />
          <m.span
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 w-px origin-top bg-accent"
            style={{ scaleY }}
          />

          {experience.map((job, idx) => (
            <li key={job.role + job.period} className={`relative pl-8 sm:pl-14 ${idx < experience.length - 1 ? "pb-16 sm:pb-20" : ""}`}>
              <m.span
                aria-hidden="true"
                className="absolute -left-[7px] top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <m.span
                  className="absolute inset-[3px] rounded-full bg-accent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -45% 0px" }}
                  transition={{ duration: 0.3 }}
                />
              </m.span>

              <Reveal amount={0.1} className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
                <m.div variants={fadeUp} className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-sm text-accent">{job.period}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-fg sm:text-[1.75rem]">{job.role}</h3>
                  <p className="mt-2 text-muted">
                    {job.company}, {job.location}
                  </p>
                </m.div>

                <div className="space-y-8">
                  {(job.groups ?? [{ title: "", items: job.highlights ?? [] }]).map((g) => (
                    <div key={g.title || "highlights"}>
                      {g.title && (
                        <m.h4 variants={fadeUp} className="mb-3 flex items-center gap-3 font-display text-base font-bold text-fg">
                          {g.title}
                          <span aria-hidden="true" className="h-px flex-1 bg-line" />
                        </m.h4>
                      )}
                      <ul className="space-y-3.5">
                        {g.items.map((h) => (
                          <m.li key={h} variants={fadeUp} className="relative pl-5 leading-relaxed text-fg/90">
                            <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent/70" />
                            {h}
                          </m.li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
