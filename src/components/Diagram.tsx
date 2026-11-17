"use client";

import { m, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useId, useMemo, useRef, useState } from "react";
import type { Diagram as DiagramSpec, DiagramNode, NodeKind } from "@/content";
import { DiagramIcon } from "./DiagramIcons";

/**
 * A project's system figure, drawn from the spec in content.ts and coloured
 * with the site theme.
 *
 * Each kind of thing has its own shape: agents are orbs with a spinning
 * "thinking" ring, data stores are cylinders, guardrails are hexagons,
 * threats are diamonds, people are circles, systems are rounded tiles.
 * Connections are pipes; packets carry a small label naming what travels.
 *
 * With `step` (−1 … nodes.length), the figure becomes a scroll-through:
 * a camera starts on the whole system, flies to each step in turn (the
 * active node grows, its icon animates, its pipes draw and start flowing),
 * then pulls back to the complete picture at the end.
 * Without `step` it renders a still overview (thumbnails, reduced motion).
 */

const W = 720;
const H = 400;
const R = 27; // shape radius

type Shape = "orb" | "cylinder" | "hex" | "diamond" | "circle" | "tile";
type KindStyle = { shape: Shape; fill: string; stroke: string; icon: string; dash?: string; fade?: boolean };
const kinds: Record<NodeKind, KindStyle> = {
  system: { shape: "tile", fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--dg-icon)" },
  agent: { shape: "orb", fill: "var(--dg-node)", stroke: "var(--accent)", icon: "var(--accent)" },
  data: { shape: "cylinder", fill: "var(--dg-node)", stroke: "var(--dg-edge)", icon: "var(--dg-icon)" },
  guard: { shape: "hex", fill: "var(--dg-guard-bg)", stroke: "var(--warn)", icon: "var(--warn)" },
  threat: { shape: "diamond", fill: "var(--dg-threat-bg)", stroke: "var(--dg-threat)", icon: "var(--dg-threat)" },
  person: { shape: "circle", fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--accent)" },
  legacy: { shape: "tile", fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--muted)", dash: "3 4", fade: true },
};

type Geo = { cx: number; cy: number; l: number; r: number; t: number; b: number };
const geo = (n: DiagramNode): Geo => {
  const w = n.w ?? 140;
  const cx = n.x + w / 2;
  const cy = n.y + 32;
  return { cx, cy, l: cx - R - 4, r: cx + R + 4, t: cy - R - 4, b: cy + R + (n.sub ? 38 : 24) };
};

function edgePath(a: Geo, b: Geo) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  let s: [number, number], e: [number, number], c1: [number, number], c2: [number, number];
  if (Math.abs(dx) >= Math.abs(dy) * 0.8) {
    s = [dx > 0 ? a.r : a.l, a.cy];
    e = [dx > 0 ? b.l - 4 : b.r + 4, b.cy];
    const mx = (e[0] - s[0]) / 2;
    c1 = [s[0] + mx, s[1]];
    c2 = [e[0] - mx, e[1]];
  } else {
    s = [a.cx, dy > 0 ? a.b : a.t];
    e = [b.cx, dy > 0 ? b.t - 4 : b.b + 4];
    const my = (e[1] - s[1]) / 2;
    c1 = [s[0], s[1] + my];
    c2 = [e[0], e[1] - my];
  }
  return {
    d: `M${s[0]},${s[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${e[0]},${e[1]}`,
    mid: [(s[0] + 3 * c1[0] + 3 * c2[0] + e[0]) / 8, (s[1] + 3 * c1[1] + 3 * c2[1] + e[1]) / 8] as [number, number],
  };
}

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");

function ShapeBody({ k, cx, cy, uid }: { k: KindStyle; cx: number; cy: number; uid: string }) {
  switch (k.shape) {
    case "orb":
      return (
        <>
          <circle cx={cx} cy={cy} r={R} fill={k.fill} />
          <circle cx={cx} cy={cy} r={R} fill={`url(#orb-${uid})`} stroke={k.stroke} strokeWidth="1.6" />
          <g className="dg-orbit">
            <circle cx={cx} cy={cy} r={R + 7} fill="none" stroke="var(--accent)" strokeOpacity="0.55" strokeDasharray="2 5" strokeWidth="1.3" />
            <circle cx={cx} cy={cy - R - 7} r="2.4" fill="var(--accent)" />
          </g>
        </>
      );
    case "cylinder": {
      const top = cy - R + 6;
      const bot = cy + R - 4;
      const rx = R;
      const ry = 7;
      return (
        <>
          <path
            d={`M${cx - rx},${top} L${cx - rx},${bot} A${rx},${ry} 0 0 0 ${cx + rx},${bot} L${cx + rx},${top}`}
            fill={k.fill}
            stroke={k.stroke}
            strokeWidth="1.5"
          />
          <path d={`M${cx - rx},${(top + bot) / 2} A${rx},${ry} 0 0 0 ${cx + rx},${(top + bot) / 2}`} fill="none" stroke={k.stroke} strokeOpacity="0.45" />
          <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={k.fill} stroke={k.stroke} strokeWidth="1.5" />
        </>
      );
    }
    case "hex":
      return <polygon points={hexPoints(cx, cy, R + 3)} fill={k.fill} stroke={k.stroke} strokeWidth="1.6" strokeLinejoin="round" />;
    case "diamond":
      return (
        <rect
          className="dg-throb"
          x={cx - R + 4}
          y={cy - R + 4}
          width={(R - 4) * 2}
          height={(R - 4) * 2}
          rx="8"
          transform={`rotate(45 ${cx} ${cy})`}
          fill={k.fill}
          stroke={k.stroke}
          strokeWidth="1.6"
        />
      );
    case "circle":
      return (
        <>
          <circle cx={cx} cy={cy} r={R} fill={k.fill} stroke={k.stroke} strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={R - 5} fill="none" stroke="var(--accent)" strokeOpacity="0.25" />
        </>
      );
    default:
      return <rect x={cx - R} y={cy - R} width={R * 2} height={R * 2} rx="15" fill={k.fill} stroke={k.stroke} strokeWidth="1.5" strokeDasharray={k.dash} />;
  }
}

function Node({
  node,
  index,
  step,
  active,
  live,
  uid,
}: {
  node: DiagramNode;
  index: number;
  step: MotionValue<number>;
  active: boolean;
  live: boolean;
  uid: string;
}) {
  const k = kinds[node.kind ?? "system"];
  const { cx, cy } = geo(node);
  const i = index;
  const scale = useTransform(step, [i - 0.75, i, i + 0.6, i + 1.2], [0.82, 1.18, 1.18, 1]);
  const opacity = useTransform(step, [i - 0.75, i - 0.05], [0.25, 1]);
  const glow = useTransform(step, [i - 0.5, i, i + 0.6, i + 1.1], [0, 1, 1, 0]);
  const iconY = k.shape === "cylinder" ? cy + 2 : cy;

  return (
    <m.g
      data-active={active ? "true" : "false"}
      style={live ? { scale, opacity, transformBox: "fill-box", transformOrigin: "50% 30%" } : undefined}
      opacity={k.fade ? 0.6 : 1}
    >
      {live && (
        <m.circle
          cx={cx}
          cy={cy}
          r={R + 14}
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth="1.5"
          style={{ opacity: glow, filter: "drop-shadow(0 0 12px var(--dg-glow))" }}
        />
      )}
      {/* floating shadow */}
      <ellipse cx={cx} cy={cy + R + 6} rx={R * 0.8} ry="3.5" fill="var(--dg-shadow)" />
      <ShapeBody k={k} cx={cx} cy={cy} uid={uid} />
      {/* gloss */}
      {k.shape !== "diamond" && <ellipse cx={cx} cy={cy - R * 0.45} rx={R * 0.55} ry={R * 0.24} fill="var(--dg-gloss)" pointerEvents="none" />}
      <g
        className="dg-icon"
        transform={`translate(${cx - 13} ${iconY - 13}) scale(${26 / 24})`}
        fill="none"
        stroke={k.icon}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <DiagramIcon name={node.icon} />
      </g>
      <text
        x={cx}
        y={cy + R + 20}
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="600"
        fill={k.fade ? "var(--muted)" : "var(--fg)"}
        textDecoration={k.fade ? "line-through" : undefined}
        paintOrder="stroke"
        stroke="var(--dg-bg)"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        {node.label}
      </text>
      {node.sub && (
        <text x={cx} y={cy + R + 34} textAnchor="middle" fontSize="10" fill="var(--muted)" paintOrder="stroke" stroke="var(--dg-bg)" strokeWidth="4" strokeLinejoin="round">
          {node.sub}
        </text>
      )}
    </m.g>
  );
}

function Edge({
  d,
  mid,
  label,
  data,
  dashed,
  fading,
  at,
  step,
  live,
  uid,
  compact,
}: {
  d: string;
  mid: [number, number];
  label?: string;
  data?: string;
  dashed?: boolean;
  fading?: boolean;
  at: number;
  step: MotionValue<number>;
  live: boolean;
  uid: string;
  compact: boolean;
}) {
  const draw = useTransform(step, [at - 0.85, at - 0.1], [0, 1]);
  const lineOpacity = useTransform(step, fading ? [at - 0.85, at - 0.6, at + 0.8, at + 1.8] : [at - 0.85, at - 0.6], fading ? [0, 1, 1, 0.25] : [0, 1]);
  const flow = useTransform(step, fading ? [at - 0.1, at, at + 0.8, at + 1.4] : [at - 0.1, at], fading ? [0, 1, 1, 0] : [0, 1]);
  const chipW = data ? data.length * 5.6 + 14 : 0;

  return (
    <g>
      {/* pipe */}
      <m.path
        d={d}
        fill="none"
        stroke={fading ? "var(--dg-stroke)" : "var(--dg-pipe)"}
        strokeWidth={6}
        strokeLinecap="round"
        style={live ? { pathLength: draw, opacity: lineOpacity } : undefined}
      />
      <m.path
        d={d}
        fill="none"
        stroke={fading ? "var(--dg-stroke)" : "var(--dg-edge)"}
        strokeWidth={1.4}
        strokeDasharray={dashed ? "4 4" : undefined}
        markerEnd={`url(#arrow-${uid})`}
        style={live ? { pathLength: draw, opacity: lineOpacity } : undefined}
      />
      {/* flowing current inside the pipe */}
      {live && !fading && (
        <m.path d={d} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinecap="round" strokeDasharray="1 9" className="dg-pipe" style={{ opacity: flow }} />
      )}
      {label && !compact && (
        <m.g style={live ? { opacity: flow } : undefined}>
          <rect x={mid[0] - label.length * 3.4 - 7} y={mid[1] - 10} width={label.length * 6.8 + 14} height="20" rx="10" fill="var(--dg-bg)" stroke="var(--dg-stroke)" />
          <text x={mid[0]} y={mid[1] + 4} textAnchor="middle" fontSize="10.5" fill="var(--muted)">
            {label}
          </text>
        </m.g>
      )}
      {/* packet, carrying a label of what travels */}
      {live && (
        <m.g style={{ opacity: flow }}>
          <g>
            <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
            <circle r="7" fill="var(--accent)" opacity="0.18" />
            <circle r="3.6" fill={fading ? "var(--muted)" : "var(--accent)"} style={{ filter: "drop-shadow(0 0 4px var(--dg-glow))" }} />
            {data && (
              <g transform="translate(0 -16)">
                <rect x={-chipW / 2} y={-8} width={chipW} height={16} rx={8} fill="var(--dg-bg)" stroke="var(--accent)" strokeOpacity="0.6" />
                <text y={3.5} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--accent)">
                  {data}
                </text>
              </g>
            )}
          </g>
        </m.g>
      )}
    </g>
  );
}

export default function Diagram({
  spec,
  step,
  zoom = 1.55,
  compact = false,
  title,
}: {
  spec: DiagramSpec;
  step?: MotionValue<number>;
  zoom?: number;
  compact?: boolean;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const fallback = useMotionValue(1000); // "everything shown" for still figures
  const live = !!step;
  const s = step ?? fallback;
  const n = spec.nodes.length;
  const [activeIdx, setActiveIdx] = useState(-1);
  useMotionValueEvent(s, "change", (v) => {
    if (!live) return;
    const next = v < -0.5 || v > n - 0.5 ? -1 : Math.round(v);
    if (next !== activeIdx) setActiveIdx(next);
  });

  const index = useMemo(() => Object.fromEntries(spec.nodes.map((nd, i) => [nd.id, i])), [spec]);
  const edges = useMemo(
    () =>
      spec.edges
        .filter((e) => index[e.from] !== undefined && index[e.to] !== undefined)
        .map((e) => ({
          ...e,
          at: e.at ?? Math.max(index[e.from], index[e.to]),
          ...edgePath(geo(spec.nodes[index[e.from]]), geo(spec.nodes[index[e.to]])),
        })),
    [spec, index]
  );

  // ---- camera: overview → each node → overview -------------------------
  const camRef = useRef<SVGGElement>(null);
  const { input, xs, ys, zs } = useMemo(() => {
    const hw = W / 2 / zoom;
    const hh = H / 2 / zoom;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const pts = spec.nodes.map((nd) => {
      const g = geo(nd);
      return [clamp(g.cx, hw, W - hw), clamp(g.cy + 12, hh, H - hh)];
    });
    return {
      input: [-1, ...spec.nodes.map((_, i) => i), n],
      xs: [W / 2, ...pts.map((p) => p[0]), W / 2],
      ys: [H / 2, ...pts.map((p) => p[1]), H / 2],
      zs: [1, ...pts.map(() => zoom), 1],
    };
  }, [spec, zoom, n]);
  const camX = useTransform(s, input, xs);
  const camY = useTransform(s, input, ys);
  const camZ = useTransform(s, input, zs);
  const cam = useTransform([camX, camY, camZ], ([x, y, z]: number[]) => `translate(${W / 2 - z * x} ${H / 2 - z * y}) scale(${z})`);
  useMotionValueEvent(cam, "change", (v) => {
    if (live) camRef.current?.setAttribute("transform", v);
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role={compact ? undefined : "img"}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : `${title ? title + ": " : ""}${spec.caption}`}
      className="block h-auto w-full"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", overflow: "hidden" }}
    >
      <defs>
        <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
          <path d="M0,1 L9,5 L0,9 z" fill="var(--dg-edge)" />
        </marker>
        <pattern id={`grid-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="var(--grid)" />
        </pattern>
        <radialGradient id={`orb-${uid}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.38 }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0.05 }} />
        </radialGradient>
      </defs>

      <g ref={camRef} transform={live ? cam.get() : undefined}>
        <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={`url(#grid-${uid})`} />

        {spec.frame && (
          <g>
            <rect x="10" y="10" width={W - 20} height={H - 20} rx="18" fill="none" stroke="var(--accent)" strokeDasharray="6 5" strokeOpacity="0.5" />
            {!compact && (
              <text x="28" y="34" fontSize="12" fontWeight="600" fill="var(--accent)">
                {spec.frame}
              </text>
            )}
          </g>
        )}

        {edges.map((e) => (
          <Edge key={`${e.from}-${e.to}`} {...e} step={s} live={live} uid={uid} compact={compact} />
        ))}

        {spec.nodes.map((nd, i) => (
          <Node key={nd.id} node={nd} index={i} step={s} active={i === activeIdx} live={live} uid={uid} />
        ))}
      </g>
    </svg>
  );
}
