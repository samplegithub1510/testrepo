"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * A faint dot grid with a few signal pulses travelling along it, like
 * requests being routed between nodes. Runs on a tiny canvas, pauses when
 * off-screen or in a background tab, and is skipped for reduced motion.
 */
const GAP = 28;

type Pulse = { x: number; y: number; dx: number; dy: number; left: number; trail: { x: number; y: number }[] };

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let pulses: Pulse[] = [];
    let last = performance.now();
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2ee6d0";
    let color = accent();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): Pulse => {
      const cols = Math.floor(w / GAP);
      const rows = Math.floor(h / GAP);
      const horizontal = Math.random() > 0.5;
      const dir = Math.random() > 0.5 ? 1 : -1;
      return {
        x: (1 + Math.floor(Math.random() * Math.max(cols - 1, 1))) * GAP,
        y: (1 + Math.floor(Math.random() * Math.max(rows - 1, 1))) * GAP,
        dx: horizontal ? dir : 0,
        dy: horizontal ? 0 : dir,
        left: GAP * (3 + Math.floor(Math.random() * 7)),
        trail: [],
      };
    };

    const maxPulses = () => (w < 640 ? 3 : 6);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, w, h);

      while (pulses.length < maxPulses() && Math.random() < 0.04) pulses.push(spawn());

      const speed = 0.09 * dt; // px per ms * dt
      pulses = pulses.filter((p) => p.left > -GAP * 4);
      for (const p of pulses) {
        if (p.left > 0) {
          p.x += p.dx * speed;
          p.y += p.dy * speed;
          p.left -= speed;
          // occasionally turn at a grid node, like a routed message
          if (Math.abs(p.x % GAP) < speed && Math.abs(p.y % GAP) < speed && Math.random() < 0.12) {
            const turn = Math.random() > 0.5 ? 1 : -1;
            [p.dx, p.dy] = p.dx !== 0 ? [0, turn] : [turn, 0];
            p.x = Math.round(p.x / GAP) * GAP;
            p.y = Math.round(p.y / GAP) * GAP;
          }
          p.trail.push({ x: p.x, y: p.y });
        } else {
          p.left -= speed;
          p.trail.shift();
        }
        if (p.trail.length > 26) p.trail.shift();

        // trail
        for (let i = 1; i < p.trail.length; i++) {
          const a = p.trail[i - 1];
          const b = p.trail[i];
          ctx.strokeStyle = color;
          ctx.globalAlpha = (i / p.trail.length) * 0.35;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        // head
        if (p.left > 0) {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(canvas);
    const onVis = () => {
      visible = document.visibilityState === "visible";
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => (color = accent()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="dot-grid absolute inset-0" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ maskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 75%)" }}
      />
      <div
        className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 65%)" }}
      />
    </div>
  );
}
