// DrawingSheet.tsx - Architectural blueprint sheet, SVG stroke-draw primitives,
// dimension callouts, keyframed browser pan/zoom with velocity blur, and 3D phone frame.
// Adapted from Dbar2/basement-ready (MIT) to read tokens from ../theme and ../easings.

import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { getLength } from "@remotion/paths";
import { easings } from "../easings";
import { prog } from "../lib/whisper-cue";
import { canvas, colors, fonts } from "../theme";

export const INSET = 28;

/** A path that strokes itself in as `p` goes 0 -> 1. */
export const Draw: React.FC<{
  d: string;
  p: number;
  stroke?: string;
  width?: number;
  fill?: string;
  cap?: "butt" | "round" | "square";
  opacity?: number;
}> = ({ d, p, stroke = colors.ink, width = 2, fill = "none", cap = "square", opacity = 1 }) => {
  const len = Math.max(1, getLength(d));
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin="miter"
      strokeDasharray={`${len} ${len}`}
      strokeDashoffset={len * (1 - p)}
      opacity={opacity}
    />
  );
};

/** Technical dimension line with tick ends and monospaced figure centered in a knockout badge. */
export const Dim: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  p: number;
  size?: number;
  color?: string;
  bg?: string;
}> = ({ x1, y1, x2, y2, label, p, size = 20, color = colors.ink, bg = colors.background }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = (-dy / len) * 7;
  const ny = (dx / len) * 7;
  const mx = x1 + dx * 0.5;
  const my = y1 + dy * 0.5;
  const vertical = Math.abs(dy) > Math.abs(dx);
  const tw = label.length * size * 0.62 + 16;
  const labelP = prog(p * 30, 18, 10);
  return (
    <g>
      <Draw d={`M${x1} ${y1} L${x1 + dx * p} ${y1 + dy * p}`} p={1} stroke={color} width={1.5} />
      <Draw d={`M${x1 - nx} ${y1 - ny} L${x1 + nx} ${y1 + ny}`} p={Math.min(1, p * 4)} stroke={color} width={1.5} />
      <Draw d={`M${x2 - nx} ${y2 - ny} L${x2 + nx} ${y2 + ny}`} p={p >= 1 ? 1 : 0} stroke={color} width={1.5} />
      <g opacity={labelP} transform={`translate(${mx} ${my}) ${vertical ? "rotate(-90)" : ""}`}>
        <rect x={-tw / 2} y={-size * 0.75} width={tw} height={size * 1.5} fill={bg} />
        <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={fonts.mono} fontSize={size} fill={color}>
          {label}
        </text>
      </g>
    </g>
  );
};

/** Architectural drawing sheet border and title block frame. */
export const Sheet: React.FC<{
  brand?: string;
  mark?: React.ReactNode;
  name: string;
  index: number;
  of: number;
  children: React.ReactNode;
}> = ({ brand = "Product Demo", mark, name, index, of, children }) => {
  const W = canvas.width;
  const H = canvas.height;
  const tbW = 600;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, fontFamily: fonts.ui, color: colors.ink }}>
      {children}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <rect x={INSET} y={INSET} width={W - INSET * 2} height={H - INSET * 2} fill="none" stroke={colors.border} strokeWidth={1} />
        <line x1={W - INSET - tbW} y1={H - INSET - 64} x2={W - INSET} y2={H - INSET - 64} stroke={colors.ink} strokeWidth={1} />
        <line x1={W - INSET - tbW} y1={H - INSET - 64} x2={W - INSET - tbW} y2={H - INSET} stroke={colors.border} strokeWidth={1} />
        <line x1={W - INSET - 112} y1={H - INSET - 64} x2={W - INSET - 112} y2={H - INSET} stroke={colors.border} strokeWidth={1} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: W - INSET - tbW + 20,
          top: H - INSET - 64,
          height: 64,
          width: tbW - 20 - 112,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {mark}
        <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: "-0.02em" }}>{brand}</span>
        <span style={{ width: 1, height: 24, background: colors.border, margin: "0 6px" }} />
        <span style={{ fontWeight: 600, fontSize: 19, color: colors.inkMuted }}>{name}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: W - INSET - 112,
          width: 112,
          top: H - INSET - 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.mono,
          fontSize: 18,
        }}
      >
        {String(index).padStart(2, "0")} / {String(of).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/** Camera keyframe for Browser: [secondsInShot, zoom, focusX (0..1), focusY (0..1)]. */
export type CamKey = [number, number, number, number];

const camAt = (keys: CamKey[] | undefined, t: number) => {
  if (!keys || !keys.length) return { z: 1, fx: 0.5, fy: 0.5 };
  if (t <= keys[0][0]) return { z: keys[0][1], fx: keys[0][2], fy: keys[0][3] };
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, z0, x0, y0] = keys[i];
    const [t1, z1, x1, y1] = keys[i + 1];
    if (t <= t1) {
      const k = easings.slowInLand(Math.min(1, Math.max(0, (t - t0) / Math.max(0.001, t1 - t0))));
      return { z: z0 + (z1 - z0) * k, fx: x0 + (x1 - x0) * k, fy: y0 + (y1 - y0) * k };
    }
  }
  const last = keys[keys.length - 1];
  return { z: last[1], fx: last[2], fy: last[3] };
};

/** Browser window wrapping a screencast or screenshot with eased pan/zoom + directional velocity blur. */
export const Browser: React.FC<{
  x: number;
  y: number;
  w: number;
  src: string;
  start?: number;
  url?: string;
  p?: number;
  rate?: number;
  cam?: CamKey[];
  tilt?: boolean;
  tag?: string;
  aspect?: number;
}> = ({
  x,
  y,
  w,
  src,
  start = 0,
  url = "app.example.com",
  p = 1,
  rate = 1,
  cam,
  tilt = false,
  tag,
  aspect = 1080 / 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w * aspect;
  const still = /\.(png|jpe?g|webp|avif)$/i.test(src);
  const bar = 40;
  const c = camAt(cam, frame / fps);
  const c0 = camAt(cam, (frame - 1) / fps);
  const blur = Math.min(
    3.5,
    Math.abs(c.z - c0.z) * 140 + (Math.abs(c.fx - c0.fx) + Math.abs(c.fy - c0.fy)) * 180,
  );
  const dir = src.length % 2 ? 1 : -1;
  const k = easings.slowInLand(Math.min(1, Math.max(0, frame / 150)));
  const rotY = tilt ? dir * (-15 + 23 * k) + 1.2 * Math.sin(frame / 70) : 0;
  const rotX = tilt ? 7 - 4 * k : 0;
  const dolly = tilt ? -150 + 190 * easings.slowInLand(Math.min(1, Math.max(0, frame / 120))) : 0;
  const floatY = tilt ? 5 * Math.sin(frame / 55) : 0;
  const glare = Math.min(1, Math.max(0, (frame - 6) / 34));

  const tx = (0.5 - c.fx) * w * (c.z - 1);
  const ty = (0.5 - c.fy) * h * (c.z - 1);
  const maxX = (w * (c.z - 1)) / 2;
  const maxY = (h * (c.z - 1)) / 2;
  const cx = Math.max(-maxX, Math.min(maxX, tx));
  const cy = Math.max(-maxY, Math.min(maxY, ty));

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - p) * 40,
        width: w,
        height: h + bar,
        borderRadius: 6,
        border: `1.5px solid ${colors.ink}`,
        background: colors.surface,
        overflow: "hidden",
        opacity: p,
        transform: tilt
          ? `perspective(1800px) translateZ(${dolly}px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(${floatY}px)`
          : undefined,
        boxShadow: tilt
          ? `0 50px 90px -40px rgba(17, 24, 39, 0.45), 0 12px 24px -12px ${colors.shadowTint}`
          : undefined,
      }}
    >
      <div
        style={{
          height: bar,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 11,
              height: 11,
              borderRadius: 99,
              border: `1.5px solid ${colors.ink}`,
              opacity: 0.6,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 18,
            fontFamily: fonts.mono,
            fontSize: 16,
            color: colors.inkMuted,
            padding: "3px 14px",
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
          }}
        >
          {url}
        </span>
        {tag && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 17,
              color: colors.ink,
              padding: "3px 12px",
              border: `1.5px solid ${colors.ink}`,
              borderRadius: 4,
            }}
          >
            {tag}
          </span>
        )}
      </div>
      <div style={{ width: w, height: h, overflow: "hidden", position: "relative" }}>
        <div
          style={{
            width: w,
            height: h,
            transform: `translate(${cx}px, ${cy}px) scale(${c.z})`,
            transformOrigin: "50% 50%",
            filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined,
          }}
        >
          {still ? (
            <Img src={staticFile(src)} style={{ width: w, height: h, display: "block" }} />
          ) : (
            <OffthreadVideo
              src={staticFile(src)}
              startFrom={Math.round(start * fps)}
              playbackRate={rate}
              muted
              style={{ width: w, height: h, display: "block" }}
            />
          )}
        </div>
        {tilt && glare > 0 && glare < 1 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 60%)",
              transform: `translateX(${(glare * 2 - 1) * 110}%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

/** Drawn mobile phone frame (390x844 logical aspect) with subtle 3D pivot. */
export const Phone: React.FC<{
  x: number;
  y: number;
  h: number;
  src?: string;
  start?: number;
  p?: number;
  rate?: number;
  children?: React.ReactNode;
}> = ({ x, y, h, src, start = 0, p = 1, rate = 1, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sw = (h - 28) * (390 / 844);
  const w = sw + 28;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - p) * 40,
        width: w,
        height: h,
        borderRadius: 54,
        border: `3px solid ${colors.ink}`,
        background: colors.ink,
        padding: 11,
        opacity: p,
        boxSizing: "border-box",
        transform: `perspective(1800px) rotateY(${-18 + 24 * easings.slowInLand(Math.min(1, frame / 150))}deg) rotateX(5deg)`,
        boxShadow: "0 50px 90px -40px rgba(17, 24, 39, 0.5)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 42,
          overflow: "hidden",
          background: colors.surface,
          position: "relative",
        }}
      >
        {src ? (
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={Math.round(start * fps)}
            playbackRate={rate}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

/** Compact status pill with solid indicator square. */
export const Status: React.FC<{
  color?: string;
  children: React.ReactNode;
  size?: number;
}> = ({ color = colors.accent, children, size = 22 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color, fontWeight: 600, fontSize: size }}>
    <span style={{ width: 10, height: 10, background: color }} />
    {children}
  </span>
);
