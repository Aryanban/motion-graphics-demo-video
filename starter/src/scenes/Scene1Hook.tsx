// Scene 1: The Hook — "The Web Was Built for Human Eyes"
// Shows the friction: massive DOM token bloat, modal traps, and agent failure.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BgMesh, Grain, Vignette } from "../components/Atmosphere";
import { Counter } from "../components/Counter";
import { sceneBeats } from "../scene-frames";
import { colors, fonts } from "../theme";
import { BACKBEATS, SCENES } from "../timing";

const hits = sceneBeats(BACKBEATS, SCENES.hook);
const SUBTITLE_IN = hits[0] ?? 15;
const DOM_CARD_IN = hits[1] ?? 45;
const ALERT_IN = hits[2] ?? 75;

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Subtle continuous camera drift
  const cameraScale = interpolate(frame, [0, SCENES.hook.duration], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, SCENES.hook.duration], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrance springs
  const subtitleProgress = spring({
    frame: frame - SUBTITLE_IN,
    fps,
    config: { damping: 18, stiffness: 140 },
  });

  const cardProgress = spring({
    frame: frame - DOM_CARD_IN,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const alertProgress = spring({
    frame: frame - ALERT_IN,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgCanvas,
        fontFamily: fonts.ui,
        overflow: "hidden",
      }}
    >
      <BgMesh bg={colors.bgCanvas} primary={colors.accent} accentSoft="rgba(244,63,94,0.12)" />

      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Eyebrow badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.04)",
            border: `1px solid ${colors.borderSubtle}`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colors.signalDanger,
              boxShadow: `0 0 12px ${colors.signalDanger}`,
            }}
          />
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textSecondary,
              fontWeight: 600,
            }}
          >
            Web Agent Diagnostic
          </span>
        </div>

        {/* Main Headline — Composed from frame 0 */}
        <h1
          style={{
            margin: 0,
            fontFamily: fonts.display,
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: colors.textPrimary,
            textAlign: "center",
            maxWidth: 1200,
          }}
        >
          The web was built for human eyes.
        </h1>

        {/* Subtitle entrance on backbeat 1 */}
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            lineHeight: 1.35,
            color: colors.textSecondary,
            textAlign: "center",
            maxWidth: 960,
            opacity: subtitleProgress,
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [24, 0])}px)`,
          }}
        >
          Autonomous agents choke on 50,000-token DOM bloat & modal traps.
        </div>

        {/* Code / DOM Pain Card */}
        <div
          style={{
            marginTop: 48,
            width: 860,
            borderRadius: 20,
            background: colors.bgPanel,
            border: `1px solid ${colors.borderMedium}`,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
            padding: "24px 32px",
            boxSizing: "border-box",
            opacity: cardProgress,
            transform: `translateY(${interpolate(cardProgress, [0, 1], [50, 0])}px) scale(${interpolate(
              cardProgress,
              [0, 1],
              [0.95, 1],
            )})`,
          }}
        >
          {/* Card Topbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${colors.borderSubtle}`,
              paddingBottom: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
            </div>

            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                color: colors.textTertiary,
              }}
            >
              raw_dom_inspector.html
            </div>

            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                color: colors.signalDanger,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>TOKEN OVERFLOW:</span>
              <Counter
                startFrame={DOM_CARD_IN}
                duration={35}
                from={1240}
                to={48650}
                format={(n) => `${n.toLocaleString()} TOKENS`}
                style={{ fontWeight: 700 }}
              />
            </div>
          </div>

          {/* Code lines */}
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#9ca3af",
            }}
          >
            <div>
              <span style={{ color: "#f43f5e" }}>&lt;div</span> <span style={{ color: "#38bdf8" }}>class</span>=
              <span style={{ color: "#a5b4fc" }}>&quot;app-root modal-backdrop-frozen&quot;</span>&gt;
            </div>
            <div style={{ paddingLeft: 24 }}>
              <span style={{ color: "#f43f5e" }}>&lt;section</span> <span style={{ color: "#38bdf8" }}>data-trap</span>=
              <span style={{ color: "#f43f5e" }}>&quot;unhandled-cookie-wall&quot;</span>&gt;
            </div>
            <div style={{ paddingLeft: 48 }}>
              <span style={{ color: "#f43f5e" }}>&lt;button</span> <span style={{ color: "#38bdf8" }}>class</span>=
              <span style={{ color: "#a5b4fc" }}>&quot;btn-ghost unlabelled-svg-only&quot;</span>&gt;
              <span style={{ color: "#6b7280" }}>/* Missing aria-label &amp; coordinates */</span>
              <span style={{ color: "#f43f5e" }}>&lt;/button&gt;</span>
            </div>
            <div style={{ paddingLeft: 24 }}>
              <span style={{ color: "#f43f5e" }}>&lt;/section&gt;</span>
            </div>
            <div>
              <span style={{ color: "#f43f5e" }}>&lt;/div&gt;</span>
            </div>
          </div>

          {/* Alarm warning alert */}
          <div
            style={{
              marginTop: 18,
              padding: "10px 18px",
              borderRadius: 10,
              background: "rgba(244, 63, 94, 0.12)",
              border: `1px solid rgba(244, 63, 94, 0.3)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: alertProgress,
              transform: `scale(${interpolate(alertProgress, [0, 1], [0.96, 1])})`,
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                color: "#fda4af",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ⚠️ AGENT TIMEOUT LOOP DETECTED
            </span>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary }}>
              Latency &gt; 12.4s · Context Limit Exceeded
            </span>
          </div>
        </div>
      </div>

      <Vignette strength={0.3} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
