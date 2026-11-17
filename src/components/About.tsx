"use client";

import { m } from "framer-motion";
import { about, aboutStatIds, profile, stats } from "@/content";
import Counter from "./Counter";
import { fadeUp, Reveal, RevealItem, SectionHeading } from "./Reveal";

export default function About() {
  const aboutStats = aboutStatIds.map((id) => stats.find((s) => s.id === id)!).filter(Boolean);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <m.figure
          initial={{ opacity: 0, y: 32, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm self-start lg:sticky lg:top-28 lg:mx-0 lg:mt-24"
        >
          <div className="absolute -inset-3 -z-10 rounded-[1.75rem] border border-accent/30" aria-hidden="true" />
          <picture>
            <source media="(max-width: 640px)" srcSet={profile.photo.srcSmall} type="image/webp" />
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={960}
              height={1200}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-3xl object-cover"
            />
          </picture>
        </m.figure>

        <div>
          <SectionHeading id="about" title={about.title} />
          <Reveal className="space-y-5 text-lg leading-relaxed text-fg/90">
            {about.paragraphs.map((p) => (
              <RevealItem key={p} as="p" className="max-w-[62ch]">
                {p}
              </RevealItem>
            ))}
          </Reveal>

          <Reveal as="ul" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {aboutStats.map((s) => (
              <m.li key={s.id} variants={fadeUp} className="bg-bg p-5 sm:p-6">
                <Counter stat={s} className="block font-mono text-3xl font-semibold text-accent sm:text-4xl" />
                <span className="mt-2 block text-sm leading-snug text-muted">{s.label}</span>
              </m.li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
