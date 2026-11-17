"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile, projects, type Project } from "@/content";
import Diagram from "./Diagram";
import { StatusTag } from "./ProjectCard";
import { useMotionPref } from "./useMotionPref";

const ease = [0.22, 1, 0.36, 1] as const;
const STEP_PX = 190; // scroll distance per diagram step

/**
 * The figure pins in place while the reader scrolls; every STEP_PX of scroll
 * advances one step, enlarging that card and drawing its connections.
 */
function ScrollFigure({ project, scroller }: { project: Project; scroller: React.RefObject<HTMLDivElement | null> }) {
  const reduce = useMotionPref();
  const wrapRef = useRef<HTMLDivElement>(null);
  const top = useRef(0);
  const n = project.diagram.nodes.length;
  const { scrollY } = useScroll({ container: scroller });

  useLayoutEffect(() => {
    const measure = () => {
      const c = scroller.current;
      const w = wrapRef.current;
      if (!c || !w) return;
      top.current = w.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 24;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scroller, project.slug]);

  const raw = useTransform(scrollY, (v) => Math.min(n - 1, Math.max(0, (v - top.current) / STEP_PX)));
  const step = useSpring(raw, { stiffness: 160, damping: 28, restDelta: 0.001 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(raw, "change", (v) => setActive(Math.min(n - 1, Math.round(v))));
  const node = project.diagram.nodes[active];

  if (reduce) {
    return (
      <figure className="mt-10 overflow-hidden rounded-2xl border border-line bg-[var(--dg-bg)] p-3 sm:p-5">
        <Diagram spec={project.diagram} title={project.title} />
        <figcaption className="mt-3 border-t border-line pt-3 text-sm text-muted">
          <span className="font-semibold text-fg">Figure 1.</span> {project.diagram.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <div ref={wrapRef} className="relative mt-10">
      <figure className="sticky top-6 overflow-hidden rounded-2xl border border-line bg-[var(--dg-bg)]">
        <div className="px-3 pt-4 sm:px-6 sm:pt-6">
          <Diagram spec={project.diagram} step={step} title={project.title} />
        </div>

        {/* step caption */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 sm:px-6">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {project.diagram.nodes.map((nd, i) => (
              <span
                key={nd.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-accent" : i < active ? "w-1.5 bg-accent/60" : "w-1.5 bg-line"}`}
              />
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={node.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted"
              aria-live="polite"
            >
              <span className="font-semibold text-fg">
                Step {active + 1} of {n}: {node.label}
              </span>
              {node.sub ? `, ${node.sub}` : ""}
            </m.p>
          </AnimatePresence>
          <m.span
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted"
            animate={{ opacity: active === n - 1 ? 0 : 1 }}
            aria-hidden="true"
          >
            Scroll
            <m.svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" animate={{ y: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <path d="M12 5v14m0 0-5-5m5 5 5-5" />
            </m.svg>
          </m.span>
        </div>
        <figcaption className="border-t border-line px-4 py-3 text-sm text-muted sm:px-6">
          <span className="font-semibold text-fg">Figure 1.</span> {project.diagram.caption}
        </figcaption>
      </figure>
      {/* scroll room for the steps (sticky ignores padding, so this is a real spacer) */}
      <div aria-hidden="true" style={{ height: (n - 1) * STEP_PX + 80 }} />
    </div>
  );
}

/**
 * A project case study, laid out like a short technical white paper and
 * styled with the site theme: title block, a scroll-driven system figure,
 * then Problem → What I built → Stack → Results. Accessible modal dialog.
 */
export default function WhitePaper({
  project,
  onClose,
  onNavigate,
}: {
  project: Project | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const lenis = useLenis();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const open = !!project;

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, project?.slug]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project?.slug]);

  const idx = project ? projects.findIndex((p) => p.slug === project.slug) : -1;
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;
  const inProgress = project?.status === "in-progress";
  const resultsTitle = inProgress ? "Status" : project?.status === "design" ? "Outcome" : "Results";

  const sections = project
    ? ([
        { title: "Problem", body: <p>{project.problem}</p> },
        { title: inProgress ? "What I'm building" : project.status === "design" ? "What I designed" : "What I built", body: <p>{project.built}</p> },
        {
          title: "Stack & components",
          body: (
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-line bg-panel px-3 py-1 text-sm text-fg">
                  {t}
                </li>
              ))}
            </ul>
          ),
        },
        ...(project.results.length
          ? [
              {
                title: resultsTitle,
                body: inProgress ? (
                  <p>This work is in progress. Results will be added when it is done.</p>
                ) : (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.results.map((r) => (
                      <li key={r} className="flex items-start gap-3 rounded-xl border border-line bg-panel p-4 font-display text-lg font-bold leading-snug text-fg">
                        <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]
          : []),
      ] as { title: string; body: React.ReactNode }[])
    : [];

  return (
    <AnimatePresence>
      {project && (
        <m.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="absolute inset-0 bg-[#02050b]/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="paper-title"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-line bg-bg shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line bg-bg-2 px-5 py-3 sm:px-8">
              <p className="text-sm text-muted">
                Case study {idx + 1} of {projects.length}
              </p>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                aria-label="Close case study"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} data-lenis-prevent className="relative overflow-y-auto overscroll-contain px-5 pb-10 pt-8 sm:px-12 sm:pt-12">
              <m.article key={project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <header className="max-w-3xl">
                  <StatusTag status={project.status} />
                  <h2 id="paper-title" className="mt-4 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-extrabold leading-[1] text-fg">
                    {project.title}
                  </h2>
                  <p className="mt-4 text-sm text-muted">{profile.name}</p>
                  <p className="mt-6 border-l-2 border-accent pl-4 text-lg leading-relaxed text-fg">{project.summary}</p>
                </header>

                <ScrollFigure key={project.slug} project={project} scroller={scrollRef} />

                <div className="mt-12 space-y-10">
                  {sections.map((s, i) => (
                    <m.section
                      key={s.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, root: scrollRef, amount: 0.4 }}
                      transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                      className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
                    >
                      <h3 className="font-display text-lg font-bold text-fg">
                        <span className="mr-2 text-accent">{i + 1}.</span>
                        {s.title}
                      </h3>
                      <div className="text-[1.05rem] leading-relaxed text-fg/90">{s.body}</div>
                    </m.section>
                  ))}

                  {project.links.length > 0 && (
                    <section className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                      <h3 className="font-display text-lg font-bold text-fg">Links</h3>
                      <ul className="flex flex-wrap gap-3">
                        {project.links.map((l) => (
                          <li key={l.href}>
                            <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink">
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {!inProgress && <p className="mt-12 text-sm text-muted">Client details are left out to respect confidentiality.</p>}

                <nav aria-label="More case studies" className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
                  {prev ? (
                    <button type="button" onClick={() => onNavigate(prev.slug)} className="rounded-xl border border-line p-4 text-left transition-colors hover:border-accent">
                      <span className="block text-xs text-muted">Previous</span>
                      <span className="mt-1 block font-semibold text-fg">{prev.title}</span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {next && (
                    <button type="button" onClick={() => onNavigate(next.slug)} className="rounded-xl border border-line p-4 text-right transition-colors hover:border-accent">
                      <span className="block text-xs text-muted">Next</span>
                      <span className="mt-1 block font-semibold text-fg">{next.title}</span>
                    </button>
                  )}
                </nav>
              </m.article>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
