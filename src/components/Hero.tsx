"use client";

import { m, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content";
import HeroBackground from "./HeroBackground";
import HeroNetwork, { type PointerState } from "./HeroNetwork";
import { useMotionPref } from "./useMotionPref";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { useScrollTo } from "./Providers";

const GLYPHS = "<>/{}[]#*+=01_";

/** Reveals text left to right, cycling unresolved letters through code glyphs. */
function useDecode(text: string, enabled: boolean) {
  const [chars, setChars] = useState(() => text.split("").map((c) => ({ c, done: true })));
  useEffect(() => {
    if (!enabled) {
      setChars(text.split("").map((c) => ({ c, done: true })));
      return;
    }
    const t0 = performance.now();
    const dur = 700;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const reveal = Math.floor(p * text.length);
      setChars(
        text.split("").map((c, i) =>
          i < reveal || c === " " ? { c, done: true } : { c: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false }
        )
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, enabled]);
  return chars;
}

function RoleRotator() {
  const reduce = useMotionPref();
  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setStarted(true);
      setI((v) => (v + 1) % profile.roles.length);
    }, 2800);
    return () => clearInterval(t);
  }, [reduce]);
  const chars = useDecode(profile.roles[i], started && !reduce);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-lg text-muted sm:text-xl">
      <span aria-hidden="true" className="font-mono text-accent">&gt;</span>
      {/* Screen readers get the full list once instead of a changing value */}
      <span className="sr-only">{profile.roles.join(", ")}</span>
      <span aria-hidden="true" className="relative inline-flex min-w-[16ch] items-baseline whitespace-pre font-medium text-fg">
        {chars.map((ch, k) => (
          <span key={k} className={ch.done ? undefined : "font-mono text-accent"}>
            {ch.c}
          </span>
        ))}
        <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-accent" />
      </span>
    </p>
  );
}

/** A link that leans toward the cursor. */
function Magnetic({ children, className, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const reduce = useMotionPref();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 18 });
  return (
    <m.a
      {...(rest as object)}
      className={className}
      style={reduce ? undefined : { x, y }}
      onPointerMove={(e: React.PointerEvent<HTMLAnchorElement>) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.a>
  );
}

export default function Hero() {
  const scrollTo = useScrollTo();
  const reduce = useMotionPref();
  const headlineWords = profile.headline.split(" ");
  const [first, ...rest] = profile.name.split(" ");
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, inside: false, burst: 0 });

  // Scroll-out: the network zooms toward you and fades; the text drifts up slower.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const netScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const netOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -110]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    pointer.current.x = x;
    pointer.current.y = y;
    pointer.current.inside = true;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (el.dataset.pointer !== "in") el.dataset.pointer = "in";
  };
  const onPointerLeave = () => {
    pointer.current.inside = false;
    if (sectionRef.current) sectionRef.current.dataset.pointer = "out";
  };
  // Clicking empty space in the hero fires a burst of packets through the network.
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    pointer.current.burst += 1;
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      <HeroBackground />
      <m.div
        className="hero-net pointer-events-none absolute inset-0"
        style={reduce ? undefined : { scale: netScale, opacity: netOpacity }}
      >
        {/* dimmer on phones, where the network sits behind the text */}
        <div className="absolute inset-0 opacity-50 md:opacity-100">
          <HeroNetwork pointer={pointer} />
        </div>
      </m.div>

      <m.div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8" style={reduce ? undefined : { y: textY }}>
        <p className="hero-fade mb-6 flex items-center gap-2 text-sm text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.location}
        </p>

        <h1 tabIndex={-1} className="font-display text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold leading-[0.9] text-fg outline-none">
          {[first, rest.join(" ")].map((part, i) => (
            <span key={part} className="block overflow-hidden pb-[0.06em]">
              <span className="hero-rise block" style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                {part}
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-3xl font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold leading-snug text-fg">
          {headlineWords.map((word, i) => (
            <span key={`${word}-${i}`} className="hero-fade inline-block" style={{ animationDelay: `${0.45 + i * 0.045}s` }}>
              {word}
              {i < headlineWords.length - 1 && "\u00A0"}
            </span>
          ))}
        </p>

        <div className="hero-fade mt-5 space-y-5" style={{ animationDelay: "0.9s" }}>
          <RoleRotator />
          <p className="max-w-[58ch] text-base text-muted sm:text-lg">{profile.valueStatement}</p>
        </div>

        <div className="hero-fade mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "1.05s" }}>
          <Magnetic
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("projects");
            }}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-accent-ink shadow-[0_10px_40px_-12px_var(--accent)]"
          >
            View my work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              <path d="M12 5v14m0 0-6-6m6 6 6-6" />
            </svg>
          </Magnetic>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <DownloadIcon />
            Download resume
          </a>
          <div className="flex items-center gap-2">
            {[
              { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
              { href: profile.github, label: "GitHub", Icon: GitHubIcon, external: true },
              { href: `mailto:${profile.email}`, label: `Email ${profile.email}`, Icon: MailIcon, external: false },
            ].map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </m.div>
    </section>
  );
}
