"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Reduced-motion preference that is safe during hydration: it reports
 * `false` on the server and first client render, then the real value.
 * This keeps server and client HTML identical.
 */
export function useMotionPref() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!reduce : false;
}
