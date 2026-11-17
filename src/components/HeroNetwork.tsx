"use client";

import { useEffect, useRef } from "react";
import { heroNetwork } from "@/content";
import { useMotionPref } from "./useMotionPref";

/**
 * The hero's centrepiece: a 3D orbit of agents and the systems they talk to.
 *
 * - An orchestrator node sits at the centre, with an inner ring of AI building
 *   blocks and an outer ring of business systems (labels live in content.ts).
 * - On load the network assembles outward from the centre.
 * - Packets travel orchestrator → AI layer → system, and some travel back.
 * - The orbit tilts toward the cursor; the nearest node lights up and draws a
 *   link to the pointer; a click fires a burst of packets.
 * - Pauses off-screen and in background tabs. Reduced motion: one still frame.
 */

export type PointerState = { x: number; y: number; inside: boolean; burst: number };

type Node = { label: string; ring: 0 | 1 | 2; a: number; y: number };
type Packet = { path: number[]; t: number; speed: number; back: boolean; trail: [number, number][] };
type Proj = { x: number; y: number; s: number; z: number };

const TAU = Math.PI * 2;
const F = 3.2; // camera distance (perspective strength)
const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export default function HeroNetwork({ pointer }: { pointer: React.RefObject<PointerState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useMotionPref();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ---- graph -----------------------------------------------------------
    const inner = heroNetwork.inner;
    const outer = heroNetwork.outer;
    const nodes: Node[] = [
      { label: heroNetwork.core, ring: 0, a: 0, y: 0 },
      ...inner.map((l, i) => ({ label: l, ring: 1 as const, a: (i / inner.length) * TAU, y: i % 2 ? 0.07 : -0.07 })),
      ...outer.map((l, i) => ({ label: l, ring: 2 as const, a: (i / outer.length) * TAU + 0.31, y: ((i % 3) - 1) * 0.11 })),
    ];
    const innerIdx = (i: number) => 1 + i;
    const outerIdx = (i: number) => 1 + inner.length + i;
    const edges: [number, number][] = [
      ...inner.map((_, i) => [0, innerIdx(i)] as [number, number]),
      ...outer.map((_, i) => [innerIdx(i % inner.length), outerIdx(i)] as [number, number]),
    ];

    // ---- theme -----------------------------------------------------------
    let colors = { accent: "#2ee6d0", fg: "#e7edf7", muted: "#93a3be" };
    let font = "system-ui, sans-serif";
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        accent: cs.getPropertyValue("--accent").trim() || colors.accent,
        fg: cs.getPropertyValue("--fg").trim() || colors.fg,
        muted: cs.getPropertyValue("--muted").trim() || colors.muted,
      };
      font = getComputedStyle(document.body).fontFamily || font;
    };
    readTheme();

    // ---- layout ----------------------------------------------------------
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 1;
    let small = false;
    const resize = () => {
      w = canvas.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 768;
      if (small) {
        cx = w * 0.72;
        cy = h * 0.8;
        R = Math.min(w * 0.46, 210);
      } else {
        cx = w * 0.76;
        cy = h * 0.48;
        R = Math.min(w * 0.22, h * 0.4, 340);
      }
    };

    // ---- state -----------------------------------------------------------
    let rot = 0.4;
    let tiltX = 1.08;
    let tiltY = 0;
    let packets: Packet[] = [];
    let lastSpawn = 0;
    let lastBurst = pointer.current?.burst ?? 0;
    let hover = -1;
    let start = performance.now();
    let last = start;
    let raf = 0;
    let visible = true;

    const project = (x: number, y: number, z: number): Proj => {
      const x1 = x * Math.cos(tiltY) + z * Math.sin(tiltY);
      const z1 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);
      const y2 = y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
      const z2 = y * Math.sin(tiltX) + z1 * Math.cos(tiltX);
      const s = F / (F + z2);
      return { x: cx + x1 * s * R, y: cy + y2 * s * R, s, z: z2 };
    };

    const spawn = (toward?: number) => {
      const oi = toward !== undefined && toward > inner.length ? toward - 1 - inner.length : Math.floor(Math.random() * outer.length);
      const ii = oi % inner.length;
      const back = Math.random() < 0.35;
      const path = [0, innerIdx(ii), outerIdx(oi)];
      packets.push({ path: back ? path.reverse() : path, t: 0, speed: 0.00045 + Math.random() * 0.0003, back, trail: [] });
    };

    const ringPath = (radius: number, expand: number) => {
      ctx.beginPath();
      for (let k = 0; k <= 72; k++) {
        const a = (k / 72) * TAU;
        const p = project(Math.cos(a) * radius * expand, 0, Math.sin(a) * radius * expand);
        if (k === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
    };

    const draw = (now: number, animate: boolean) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const intro = animate ? Math.min(1, (now - start) / 1600) : 1;
      const expand = easeOutBack(intro);

      // motion: orbit + tilt toward the pointer
      const p = pointer.current;
      if (animate) {
        rot += dt * 0.00011;
        const tx = p?.inside ? (p.y / Math.max(h, 1) - 0.5) * 0.45 : 0;
        const ty = p?.inside ? (p.x / Math.max(w, 1) - 0.5) * 0.7 : 0;
        tiltX += (1.08 + tx - tiltX) * 0.05;
        tiltY += (ty - tiltY) * 0.05;
      }

      // project nodes
      const pos: Proj[] = nodes.map((n) => {
        if (n.ring === 0) return project(0, 0, 0);
        const radius = (n.ring === 1 ? 0.48 : 1) * expand;
        const a = n.a + (n.ring === 1 ? -rot * 1.7 : rot);
        return project(Math.cos(a) * radius, n.y * expand, Math.sin(a) * radius);
      });
      const depth = (pp: Proj) => Math.max(0, Math.min(1, (pp.s - 0.72) / 0.6)); // 0 far … 1 near

      // nearest node to the pointer
      hover = -1;
      if (p?.inside && animate) {
        let best = 70 * 70;
        pos.forEach((pp, i) => {
          const d = (pp.x - p.x) ** 2 + (pp.y - p.y) ** 2;
          if (d < best) {
            best = d;
            hover = i;
          }
        });
      }

      ctx.clearRect(0, 0, w, h);

      // orbit rings
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.muted;
      ctx.globalAlpha = 0.22 * intro;
      ringPath(1, expand);
      ctx.stroke();
      ctx.globalAlpha = 0.3 * intro;
      ctx.setLineDash([3, 5]);
      ringPath(0.48, expand);
      ctx.stroke();
      ctx.setLineDash([]);

      // edges
      for (const [a, b] of edges) {
        const pa = pos[a];
        const pb = pos[b];
        const lit = hover === a || hover === b;
        ctx.strokeStyle = a === 0 || lit ? colors.accent : colors.muted;
        ctx.globalAlpha = (lit ? 0.8 : (a === 0 ? 0.45 : 0.22) * (0.45 + depth(pb))) * intro;
        ctx.lineWidth = lit ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // pointer link to the hovered node
      if (hover >= 0 && p) {
        ctx.strokeStyle = colors.accent;
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pos[hover].x, pos[hover].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // packets
      if (animate && intro > 0.7) {
        if (now - lastSpawn > (hover > inner.length ? 160 : small ? 600 : 380) && packets.length < (small ? 10 : 22)) {
          spawn(hover > inner.length ? hover : undefined);
          lastSpawn = now;
        }
        if (p && p.burst !== lastBurst) {
          lastBurst = p.burst;
          for (let k = 0; k < 12; k++) spawn();
        }
      }
      packets = packets.filter((pk) => pk.t < 1 || pk.trail.length > 0);
      for (const pk of packets) {
        if (pk.t < 1) {
          pk.t = Math.min(1, pk.t + dt * pk.speed * (animate ? 1 : 0));
          const seg = pk.t < 0.5 ? 0 : 1;
          const lt = seg === 0 ? pk.t * 2 : (pk.t - 0.5) * 2;
          const A = pos[pk.path[seg]];
          const B = pos[pk.path[seg + 1]];
          pk.trail.push([A.x + (B.x - A.x) * lt, A.y + (B.y - A.y) * lt]);
          if (pk.trail.length > 10) pk.trail.shift();
        } else {
          pk.trail.shift();
        }
        const col = pk.back ? colors.fg : colors.accent;
        for (let k = 1; k < pk.trail.length; k++) {
          ctx.strokeStyle = col;
          ctx.globalAlpha = (k / pk.trail.length) * 0.6;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(pk.trail[k - 1][0], pk.trail[k - 1][1]);
          ctx.lineTo(pk.trail[k][0], pk.trail[k][1]);
          ctx.stroke();
        }
        if (pk.t < 1 && pk.trail.length) {
          const [hx, hy] = pk.trail[pk.trail.length - 1];
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(hx, hy, 6, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(hx, hy, 2.2, 0, TAU);
          ctx.fill();
        }
      }

      // nodes, far to near
      const order = nodes.map((_, i) => i).sort((a, b) => pos[b].z - pos[a].z);
      for (const i of order) {
        const n = nodes[i];
        const pp = pos[i];
        const d = depth(pp);
        const lit = hover === i;
        if (n.ring === 0) {
          // orchestrator: pulsing rings
          for (let k = 0; k < 2; k++) {
            const ph = ((now / 1900 + k / 2) % 1) * (animate ? 1 : 0);
            ctx.strokeStyle = colors.accent;
            ctx.globalAlpha = (1 - ph) * 0.5 * intro;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(pp.x, pp.y, 9 + ph * 42, 0, TAU);
            ctx.stroke();
          }
          ctx.fillStyle = colors.accent;
          ctx.globalAlpha = 0.18;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, 16, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, 7, 0, TAU);
          ctx.fill();
          if (!small) {
            ctx.font = `600 12px ${font}`;
            ctx.textAlign = "center";
            ctx.fillStyle = colors.fg;
            ctx.globalAlpha = 0.9 * intro;
            ctx.fillText(n.label, pp.x, pp.y + 34);
          }
          continue;
        }
        const r = (n.ring === 1 ? 5 : 3.6) * pp.s * (lit ? 1.6 : 1);
        ctx.fillStyle = n.ring === 1 || lit ? colors.accent : colors.fg;
        if (n.ring === 1 && !lit) {
          // soft halo on the AI layer
          ctx.globalAlpha = 0.16 * intro;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, r + 7, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = (0.35 + 0.65 * d) * intro;
        if (lit) {
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, r + 8, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, r, 0, TAU);
        ctx.fill();
        if (!small || lit) {
          ctx.font = `${n.ring === 1 ? 600 : 500} ${lit ? 13 : 11.5}px ${font}`;
          ctx.textAlign = "left";
          ctx.fillStyle = lit ? colors.accent : n.ring === 1 ? colors.fg : colors.muted;
          ctx.globalAlpha = (lit ? 1 : 0.25 + 0.7 * d) * intro;
          ctx.fillText(n.label, pp.x + r + 6, pp.y + 4);
        }
      }
      // fade toward the text side, so the network never competes with the headline
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
      const g = small ? ctx.createLinearGradient(0, h * 0.45, 0, h * 0.75) : ctx.createLinearGradient(w * 0.44, 0, w * 0.68, 0);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      if (small) ctx.fillRect(0, 0, w, h * 0.75);
      else ctx.fillRect(0, 0, w * 0.68, h);
      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    readTheme();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now(), false);
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readTheme();
      if (reduce) draw(performance.now(), false);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (reduce) {
      draw(performance.now(), false);
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }

    let lastFrame = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }
      if (small && now - lastFrame < 32) return; // ~30fps on phones
      lastFrame = now;
      draw(now, true);
    };
    // Start once the page has loaded and the browser is idle, so the name and
    // headline paint first and the network assembles right after.
    let kick = 0;
    let idle = 0;
    let begun = false;
    const begin = () => {
      if (begun) return;
      begun = true;
      start = performance.now();
      last = start;
      raf = requestAnimationFrame(loop);
    };
    const schedule = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(begin, { timeout: 1500 });
      else kick = window.setTimeout(begin, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && document.visibilityState === "visible"));
    io.observe(canvas);
    const onVis = () => (visible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearTimeout(kick);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      window.removeEventListener("load", schedule);
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, pointer]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
