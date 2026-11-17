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
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="portrait group relative mx-auto aspect-[900/1130] w-full max-w-sm self-start lg:sticky lg:top-28 lg:mx-0 lg:mt-16"
        >
          {/* themed card the portrait stands in; the head rises above its top edge */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[22%] overflow-hidden rounded-3xl border border-line bg-bg-2">
            <div className="dot-grid absolute inset-0 opacity-80" style={{ maskImage: "none", WebkitMaskImage: "none" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(70% 55% at 50% 20%, var(--accent-soft), transparent 70%)" }} />
          </div>

          {/* orbit behind the head, echoing the hero network */}
          <svg aria-hidden="true" viewBox="0 0 400 200" className="portrait-orbit pointer-events-none absolute left-[-6%] top-[2%] w-[112%]">
            <ellipse cx="200" cy="100" rx="180" ry="44" fill="none" stroke="var(--accent)" strokeOpacity="0.45" strokeDasharray="3 6" />
            {[
              { r: 4.5, fill: "var(--accent)", dur: "14s", begin: "0s" },
              { r: 3, fill: "var(--fg)", dur: "14s", begin: "-5s" },
              { r: 3.5, fill: "var(--accent)", dur: "14s", begin: "-9.5s" },
            ].map((d, i) => (
              <circle key={i} r={d.r} fill={d.fill} opacity="0.85">
                <animateMotion dur={d.dur} begin={d.begin} repeatCount="indefinite" path="M20,100 a180,44 0 1,0 360,0 a180,44 0 1,0 -360,0" />
              </circle>
            ))}
          </svg>

          <picture>
            <source media="(max-width: 640px)" srcSet={profile.photo.srcSmall} type="image/webp" />
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={960}
              height={1205}
              loading="lazy"
              decoding="async"
              className="portrait-img relative h-full w-full object-contain object-bottom"
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
