"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { useScrollTo } from "./Providers";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.button
          type="button"
          onClick={() => {
            scrollTo("top");
            document.querySelector<HTMLElement>("#top h1")?.focus?.();
          }}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel/90 text-fg shadow-lg shadow-black/20 backdrop-blur hover:border-accent hover:text-accent sm:bottom-8 sm:right-8"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </m.button>
      )}
    </AnimatePresence>
  );
}
