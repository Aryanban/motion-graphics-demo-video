// Atmosphere.tsx - Five-layer motion graphics stack (mesh background, grade,
// procedural film grain, vignette) and reusable spring entrance/reveal primitives.
// Adapted from haidrrrry/claude-remotion-skill (MIT) to read tokens from ../theme and ../easings.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { easings } from "../easings";
import { colors } from "../theme";

/** Drifting radial gradient mesh background (Layer 1). */
export const BgMesh: React.FC<{
  bg?: string;
  primary?: string;
  accentSoft?: string;
}> = ({ bg = colors.ink, primary = colors.accent, accentSoft = colors.accentSoft }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          top: -550,
          left: -350 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${primary}33, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          bottom: -500,
          right: -300 - d2,
          filter: "blur(80px)",
          background: `radial-gradient(circle, ${accentSoft}, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Subtle soft-light color grade overlay (Layer 4). */
export const Grade: React.FC<{ tint?: string }> = ({ tint = colors.accent }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: tint,
        mixBlendMode: "soft-light",
        opacity: 0.16,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.08), transparent 28%, transparent 72%, rgba(0,0,0,0.18))",
      }}
    />
  </AbsoluteFill>
);

/** Deterministic SVG fractal-noise film grain overlay (Layer 5a). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
};

/** Radial edge vignette (Layer 5b). */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.22 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Three-property spring entrance (opacity + rise + scale). */
export const Entrance: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 120, mass: 1 },
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Fast eased vertical scene exit over the final ~10 frames of a scene. */
export const SceneExit: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const exitY = interpolate(frame, [duration - 12, duration - 2], [0, -42], {
    easing: easings.rampIn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitO = interpolate(frame, [duration - 12, duration - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        opacity: exitO,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {children}
    </div>
  );
};
