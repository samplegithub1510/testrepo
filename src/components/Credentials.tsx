"use client";

import { m } from "framer-motion";
import { certifications, education } from "@/content";
import { fadeUp, Reveal, SectionHeading } from "./Reveal";

export default function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="relative border-t border-line bg-bg-2 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="credentials" title="Certifications & education" />

        <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-muted">Certifications</h3>
            <Reveal as="ul" className="divide-y divide-line border-y border-line">
              {certifications.map((c) => (
                <m.li key={c.name} variants={fadeUp} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
                  <span className="font-medium text-fg">{c.name}</span>
                  {c.inProgress ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-0.5 text-xs font-semibold text-warn">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                      In progress
                    </span>
                  ) : c.year ? (
                    <span className="tabular font-mono text-sm text-muted">{c.year}</span>
                  ) : null}
                </m.li>
              ))}
            </Reveal>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-muted">Education</h3>
            <Reveal>
              {education.map((e) => (
                <m.div key={e.degree} variants={fadeUp} className="rounded-2xl border border-line bg-panel p-6">
                  <p className="tabular font-mono text-sm text-accent">{e.period}</p>
                  <p className="mt-3 font-display text-2xl font-bold leading-tight text-fg">{e.degree}</p>
                  <p className="mt-2 text-muted">{e.school}</p>
                </m.div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
