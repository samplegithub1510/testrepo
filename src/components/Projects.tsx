"use client";

import { useMotionPref } from "./useMotionPref";
import { m, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects, projectsIntro } from "@/content";
import ProjectCard from "./ProjectCard";
import { fadeUp, Reveal, SectionHeading } from "./Reveal";
import WhitePaper from "./WhitePaper";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setMatch(m.matches);
    const on = () => setMatch(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Desktop: the section pins and the cards slide sideways as you scroll down. */
function PinnedTrack({ items, onOpen, header }: { items: typeof projects; onOpen: (slug: string) => void; header: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (items.length - 1))));

  // Keyboard users: focusing a card scrolls the page to bring it into view.
  const focusCard = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const target = top + (span * i) / Math.max(items.length - 1, 1);
    if (Math.abs(window.scrollY - target) > 4) window.scrollTo({ top: target });
  };

  return (
    <div ref={sectionRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 [&>div]:mb-8 [&>div]:sm:mb-10">{header}</div>
        <m.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))] pr-[12vw]">
          {items.map((p, i) => (
            <ProjectCard key={p.slug} project={p} onOpen={() => onOpen(p.slug)} onFocus={() => focusCard(i)} className="w-[26rem] shrink-0 xl:w-[28rem]" />
          ))}
        </m.div>

        {/* progress dots */}
        <div className="mx-auto mt-10 flex w-full max-w-6xl items-center gap-4 px-5 sm:px-8" aria-hidden="true">
          <div className="relative h-px flex-1 bg-line">
            <m.div className="absolute inset-y-0 left-0 origin-left bg-accent" style={{ scaleX: scrollYProgress, width: "100%" }} />
          </div>
          <span className="tabular font-mono text-sm text-muted">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const desktop = useMedia("(min-width: 1024px)");
  const reduce = useMotionPref();

  const featured = projects.filter((p) => p.status !== "in-progress");
  const building = projects.filter((p) => p.status === "in-progress");
  const current = projects.find((p) => p.slug === openSlug) ?? null;

  const open = useCallback((slug: string) => {
    opener.current = document.activeElement as HTMLElement;
    setOpenSlug(slug);
  }, []);
  const close = useCallback(() => {
    setOpenSlug(null);
    setTimeout(() => opener.current?.focus({ preventScroll: true }), 30);
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className={`relative pb-24 sm:pb-32 ${desktop && !reduce ? "" : "pt-24 sm:pt-32"}`}>
      {desktop && !reduce ? (
        <PinnedTrack
          items={featured}
          onOpen={open}
          header={<SectionHeading id="projects" title={projectsIntro.title} lede={projectsIntro.lede} />}
        />
      ) : (
        <>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading id="projects" title={projectsIntro.title} lede={projectsIntro.lede} />
        </div>
        <Reveal amount={0.05} className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8">
          {featured.map((p) => (
            <m.div key={p.slug} variants={fadeUp}>
              <ProjectCard project={p} onOpen={() => open(p.slug)} className="h-full" />
            </m.div>
          ))}
        </Reveal>
        </>
      )}

      <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <m.h3 variants={fadeUp} className="font-display text-3xl font-extrabold text-fg sm:text-4xl">
            {projectsIntro.inProgressTitle}
          </m.h3>
          <m.p variants={fadeUp} className="max-w-[46ch] text-muted">
            Work under way right now, labelled as in progress until it ships.
          </m.p>
        </Reveal>
        <Reveal amount={0.05} className="grid gap-6 sm:grid-cols-2">
          {building.map((p) => (
            <m.div key={p.slug} variants={fadeUp}>
              <ProjectCard project={p} onOpen={() => open(p.slug)} className="h-full" />
            </m.div>
          ))}
        </Reveal>
      </div>

      <WhitePaper project={current} onClose={close} onNavigate={setOpenSlug} />
    </section>
  );
}
