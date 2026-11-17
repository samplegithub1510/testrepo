"use client";

import { useMotionPref } from "./useMotionPref";
import { LazyMotion, MotionConfig } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { useCallback } from "react";

/**
 * Smooth scrolling (Lenis) plus global motion settings.
 * Visitors who ask their OS for reduced motion get native scrolling and
 * Framer Motion skips transform animations for them (reducedMotion="user").
 */
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default);

export default function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useMotionPref();

  return (
    <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 1, anchors: false }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
    </LazyMotion>
  );
}

/** Scroll to a section by id, smoothly when Lenis is running, then move focus there. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (id: string) => {
      const el = id === "top" ? document.body : document.getElementById(id);
      if (!el) return;
      const done = () => {
        if (id === "top") return;
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      };
      if (lenis) {
        lenis.scrollTo(id === "top" ? 0 : el, { offset: -72, duration: 1.1, onComplete: done });
      } else {
        if (id === "top") window.scrollTo({ top: 0 });
        else el.scrollIntoView();
        done();
      }
      history.replaceState(null, "", id === "top" ? "#" : `#${id}`);
    },
    [lenis]
  );
}
