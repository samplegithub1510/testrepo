"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, profile } from "@/content";
import { useScrollTo } from "./Providers";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollTo = useScrollTo();

  // Highlight the section that occupies the middle of the viewport.
  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const hero = document.getElementById("top");
    const heroObs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (hero) heroObs.observe(hero);

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      heroObs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          onClick={go("top")}
          className="font-display text-lg font-extrabold tracking-tight text-fg"
        >
          SU<span className="text-accent">.</span>
          <span className="sr-only"> {profile.name}, back to top</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block px-3 py-2 text-sm transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <m.span
                      layoutId="nav-trace"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-[18px]">
              <m.span
                className="absolute left-0 top-0 h-[1.6px] w-full rounded-full bg-current"
                animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.2 }}
              />
              <m.span
                className="absolute bottom-0 left-0 h-[1.6px] w-full rounded-full bg-current"
                animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.2 }}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-line bg-bg/95 backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-5 py-3">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    className={`block py-3 font-display text-2xl font-bold ${
                      active === item.id ? "text-accent" : "text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
