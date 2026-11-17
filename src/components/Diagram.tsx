"use client";

import { m, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useId, useMemo, useState } from "react";
import type { Diagram as DiagramSpec, DiagramNode, NodeKind } from "@/content";
import { DiagramIcon } from "./DiagramIcons";

/**
 * A project's system figure, drawn from the spec in content.ts and coloured
 * with the site theme (dark or light).
 *
 * - `step` (a motion value from 0 to nodes.length - 1) drives the
 *   scroll-through: each card grows as it becomes the active step, its icon
 *   animates, and the connectors leading to it draw themselves, then carry
 *   small packets.
 * - Without `step` the figure is static with every card shown (thumbnails,
 *   and visitors who prefer reduced motion).
 */

const W = 720;
const H = 380;
const NODE_H = 76;

type KindStyle = { fill: string; stroke: string; icon: string; iconBg: string; dash?: string; rx: number; fade?: boolean };
const kinds: Record<NodeKind, KindStyle> = {
  system: { fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--dg-icon)", iconBg: "var(--dg-icon-bg)", rx: 14 },
  agent: { fill: "var(--dg-agent-bg)", stroke: "var(--accent)", icon: "var(--accent)", iconBg: "var(--accent-soft)", rx: 14 },
  data: { fill: "var(--dg-node)", stroke: "var(--dg-edge)", icon: "var(--dg-icon)", iconBg: "var(--dg-icon-bg)", dash: "5 4", rx: 14 },
  guard: { fill: "var(--dg-guard-bg)", stroke: "var(--warn)", icon: "var(--warn)", iconBg: "var(--dg-guard-bg)", rx: 14 },
  threat: { fill: "var(--dg-threat-bg)", stroke: "var(--dg-threat)", icon: "var(--dg-threat)", iconBg: "var(--dg-threat-bg)", rx: 14 },
  person: { fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--accent)", iconBg: "var(--accent-soft)", rx: 26 },
  legacy: { fill: "var(--dg-node)", stroke: "var(--dg-stroke)", icon: "var(--muted)", iconBg: "var(--dg-icon-bg)", dash: "3 4", rx: 14, fade: true },
};

type Geo = { cx: number; cy: number; l: number; r: number; t: number; b: number };
const geo = (n: DiagramNode): Geo => {
  const w = n.w ?? 140;
  return { cx: n.x + w / 2, cy: n.y + NODE_H / 2, l: n.x, r: n.x + w, t: n.y, b: n.y + NODE_H };
};

function edgePath(a: Geo, b: Geo) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  let s: [number, number], e: [number, number], c1: [number, number], c2: [number, number];
  if (Math.abs(dx) >= Math.abs(dy) * 0.8) {
    s = [dx > 0 ? a.r : a.l, a.cy];
    e = [dx > 0 ? b.l - 5 : b.r + 5, b.cy];
    const mx = (e[0] - s[0]) / 2;
    c1 = [s[0] + mx, s[1]];
    c2 = [e[0] - mx, e[1]];
  } else {
    s = [a.cx, dy > 0 ? a.b : a.t];
    e = [b.cx, dy > 0 ? b.t - 5 : b.b + 5];
    const my = (e[1] - s[1]) / 2;
    c1 = [s[0], s[1] + my];
    c2 = [e[0], e[1] - my];
  }
  return {
    d: `M${s[0]},${s[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${e[0]},${e[1]}`,
    mid: [(s[0] + 3 * c1[0] + 3 * c2[0] + e[0]) / 8, (s[1] + 3 * c1[1] + 3 * c2[1] + e[1]) / 8] as [number, number],
  };
}

function Node({ node, index, step, active, live }: { node: DiagramNode; index: number; step: MotionValue<number>; active: boolean; live: boolean }) {
  const k = kinds[node.kind ?? "system"];
  const w = node.w ?? 140;
  const g = geo(node);
  const i = index;
  // grows into the active step, then settles; dim until reached
  const scale = useTransform(step, [i - 0.75, i, i + 0.6, i + 1.2], [0.86, 1.14, 1.14, 1]);
  const opacity = useTransform(step, [i - 0.75, i - 0.05], [0.28, 1]);
  const glow = useTransform(step, [i - 0.5, i, i + 0.6, i + 1.1], [0, 1, 1, 0]);

  return (
    <m.g
      data-active={active ? "true" : "false"}
      style={live ? { scale, opacity, transformBox: "fill-box", transformOrigin: "center" } : undefined}
      opacity={k.fade ? 0.65 : 1}
    >
      {live && (
        <m.rect
          x={node.x - 4}
          y={node.y - 4}
          width={w + 8}
          height={NODE_H + 8}
          rx={k.rx + 4}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          style={{ opacity: glow, filter: "drop-shadow(0 0 10px var(--dg-glow))" }}
        />
      )}
      <rect x={node.x} y={node.y} width={w} height={NODE_H} rx={k.rx} fill={k.fill} stroke={k.stroke} strokeWidth="1.5" strokeDasharray={k.dash} />
      <circle cx={g.cx} cy={node.y + 24} r="15" fill={k.iconBg} />
      <g
        className="dg-icon"
        transform={`translate(${g.cx - 10} ${node.y + 14}) scale(${20 / 24})`}
        fill="none"
        stroke={k.icon}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <DiagramIcon name={node.icon} />
      </g>
      <text
        x={g.cx}
        y={node.sub ? node.y + 54 : node.y + 58}
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="600"
        fill={k.fade ? "var(--muted)" : "var(--fg)"}
        textDecoration={k.fade ? "line-through" : undefined}
      >
        {node.label}
      </text>
      {node.sub && (
        <text x={g.cx} y={node.y + 68} textAnchor="middle" fontSize="10" fill="var(--muted)">
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
  const packet = useTransform(step, fading ? [at - 0.1, at, at + 0.8, at + 1.4] : [at - 0.1, at], fading ? [0, 1, 1, 0] : [0, 1]);

  return (
    <g>
      <m.path
        d={d}
        fill="none"
        stroke={fading ? "var(--dg-stroke)" : "var(--dg-edge)"}
        strokeWidth={1.6}
        strokeDasharray={dashed || fading ? "5 5" : undefined}
        markerEnd={`url(#arrow-${uid})`}
        style={live ? { pathLength: draw, opacity: lineOpacity } : undefined}
      />
      {label && !compact && (
        <m.g style={live ? { opacity: packet } : undefined}>
          <rect x={mid[0] - label.length * 3.4 - 7} y={mid[1] - 10} width={label.length * 6.8 + 14} height="20" rx="10" fill="var(--dg-bg)" stroke="var(--dg-stroke)" />
          <text x={mid[0]} y={mid[1] + 4} textAnchor="middle" fontSize="10.5" fill="var(--muted)">
            {label}
          </text>
        </m.g>
      )}
      {live && (
        <m.circle r="3.6" fill={fading ? "var(--muted)" : "var(--accent)"} style={{ opacity: packet, filter: "drop-shadow(0 0 4px var(--dg-glow))" }}>
          <animateMotion dur="2s" repeatCount="indefinite" path={d} />
        </m.circle>
      )}
    </g>
  );
}

export default function Diagram({
  spec,
  step,
  compact = false,
  title,
}: {
  spec: DiagramSpec;
  step?: MotionValue<number>;
  compact?: boolean;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const fallback = useMotionValue(1000); // "everything shown" for static figures
  const live = !!step;
  const s = step ?? fallback;
  const [activeIdx, setActiveIdx] = useState(live ? 0 : -1);
  useMotionValueEvent(s, "change", (v) => {
    if (!live) return;
    const next = Math.min(spec.nodes.length - 1, Math.max(0, Math.round(v)));
    if (next !== activeIdx) setActiveIdx(next);
  });

  const index = useMemo(() => Object.fromEntries(spec.nodes.map((n, i) => [n.id, i])), [spec]);
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

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role={compact ? undefined : "img"}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : `${title ? title + ": " : ""}${spec.caption}`}
      className="block h-auto w-full"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", overflow: "visible" }}
    >
      <defs>
        <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,1 L9,5 L0,9 z" fill="var(--dg-edge)" />
        </marker>
        <pattern id={`grid-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="var(--grid)" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill={`url(#grid-${uid})`} />

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

      {spec.nodes.map((n, i) => (
        <Node key={n.id} node={n} index={i} step={s} active={i === activeIdx} live={live} />
      ))}
    </svg>
  );
}
