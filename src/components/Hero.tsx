"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/content";
import HeroBackground from "./HeroBackground";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { useScrollTo } from "./Providers";

const ease = [0.22, 1, 0.36, 1] as const;

function RoleRotator() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-lg text-muted sm:text-xl">
      <span aria-hidden="true" className="font-mono text-accent">&gt;</span>
      {/* Screen readers get the full list once instead of a changing value */}
      <span className="sr-only">{profile.roles.join(", ")}</span>
      <span aria-hidden="true" className="relative inline-flex min-w-[16ch] items-baseline font-medium text-fg">
        <AnimatePresence mode="wait">
          <m.span
            key={profile.roles[i]}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease }}
          >
            {profile.roles[i]}
          </m.span>
        </AnimatePresence>
        <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-accent" />
      </span>
    </p>
  );
}

export default function Hero() {
  const scrollTo = useScrollTo();
  const headlineWords = profile.headline.split(" ");
  const [first, ...rest] = profile.name.split(" ");

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <HeroBackground />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
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
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("projects");
            }}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            View my work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              <path d="M12 5v14m0 0-6-6m6 6 6-6" />
            </svg>
          </a>
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
      </div>
    </section>
  );
}
