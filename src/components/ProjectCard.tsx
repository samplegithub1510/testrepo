"use client";

import { useMotionPref } from "./useMotionPref";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content";
import Diagram from "./Diagram";

export function StatusTag({ status, onPaper = false }: { status: Project["status"]; onPaper?: boolean }) {
  if (status === "in-progress")
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          onPaper ? "border-[#b26b00]/40 bg-[#fff5e3] text-[#8a5300]" : "border-warn/40 bg-warn/10 text-warn"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        In progress
      </span>
    );
  if (status === "design")
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          onPaper ? "border-paper-accent/40 text-paper-accent" : "border-accent/40 text-accent"
        }`}
      >
        Design
      </span>
    );
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${onPaper ? "border-paper-line text-paper-muted" : "border-line text-muted"}`}>
      Shipped
    </span>
  );
}

/** Mounts the thumbnail figure only when the card gets near the screen (keeps first load light). */
function LazyThumb({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "600px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="aspect-[720/400] transition-transform duration-500 group-hover:scale-[1.03]">
      {show && <Diagram spec={project.diagram} compact />}
    </div>
  );
}

export default function ProjectCard({
  project,
  onOpen,
  onFocus,
  className = "",
}: {
  project: Project;
  onOpen: () => void;
  onFocus?: () => void;
  className?: string;
}) {
  const reduce = useMotionPref();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <m.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-panel text-left transition-[border-color,box-shadow] duration-300 hover:border-accent/60 hover:shadow-[0_24px_60px_-30px_var(--accent)] focus-within:border-accent"
      >
        {/* paper thumbnail */}
        <div className="relative m-3 mb-0 overflow-hidden rounded-xl border border-line bg-[var(--dg-bg)] p-2">
          <LazyThumb project={project} />

          {/* stack, revealed on hover / focus (always visible on touch screens) */}
          <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-gradient-to-t from-[var(--dg-bg)] via-[var(--dg-bg)]/95 to-transparent px-3 pb-3 pt-8 transition-all duration-300 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100">
            <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.slice(0, 6).map((t) => (
                <li key={t} className="rounded-full border border-line bg-panel px-2 py-0.5 text-[0.7rem] font-medium text-fg">
                  {t}
                </li>
              ))}
              {project.stack.length > 6 && (
                <li className="rounded-full px-1.5 py-0.5 text-[0.7rem] font-medium text-muted">+{project.stack.length - 6} more</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-3">
            <StatusTag status={project.status} />
          </div>
          <h3 className="font-display text-xl font-bold leading-tight text-fg sm:text-[1.4rem]">
            {/* The title is the real button; its ::after stretches over the whole card so the card is clickable */}
            <button
              type="button"
              onClick={onOpen}
              onFocus={onFocus}
              aria-haspopup="dialog"
              aria-describedby={`card-${project.slug}-summary`}
              data-project={project.slug}
              className="text-left outline-none after:absolute after:inset-0 after:rounded-[1.25rem] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
            >
              {project.title}
            </button>
          </h3>
          <p id={`card-${project.slug}-summary`} className="mt-2 text-[0.95rem] leading-snug text-muted">{project.summary}</p>
          <span aria-hidden="true" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
            Read the case study
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </span>
        </div>
      </m.div>
    </div>
  );
}
