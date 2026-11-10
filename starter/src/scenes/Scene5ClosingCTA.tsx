// Scene 5: Closing CTA & Local Sovereignty
// Meta Llama 3.2 local runtime, zero API bills, and GitHub repository clone CTA.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AgentBot } from "../components/AgentBot";
import { BgMesh, Grain, Vignette } from "../components/Atmosphere";
import { sceneBeats } from "../scene-frames";
import { colors, fonts } from "../theme";
import { BACKBEATS, SCENES } from "../timing";

const hits = sceneBeats(BACKBEATS, SCENES.closingCta);
const PILLS_IN = hits[1] ?? 30; // local frame 30 (master frame 495)
const TERMINAL_IN = hits[2] ?? 60; // local frame 60 (master frame 525)
const FOOTER_IN = hits[3] ?? 90; // local frame 90 (master frame 555)

export const Scene5ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Outro fade over last 18 frames
  const outroOpacity = interpolate(frame, [SCENES.closingCta.duration - 18, SCENES.closingCta.duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const pillsSpring = spring({
    frame: frame - PILLS_IN,
    fps,
    config: { damping: 18, stiffness: 130 },
  });

  const terminalSpring = spring({
    frame: frame - TERMINAL_IN,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const footerSpring = spring({
    frame: frame - FOOTER_IN,
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgCanvas,
        fontFamily: fonts.ui,
        overflow: "hidden",
        opacity: outroOpacity,
      }}
    >
      <BgMesh bg={colors.bgCanvas} primary={colors.accent} accentSoft="rgba(16,185,129,0.12)" />

      {/* Animated AI Agent Victorious Outro */}
      <AgentBot
        x={1520}
        y={420}
        emotion="victorious"
        dialogue="Runway clear! Ready to deploy."
        dialogueInFrame={TERMINAL_IN}
        scale={1.2}
        flipX={true}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Central Logo Lockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: logoSpring,
            transform: `scale(${interpolate(logoSpring, [0, 1], [0.9, 1])})`,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: `linear-gradient(135deg, ${colors.accent}, #1e40af)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 45px rgba(59, 130, 246, 0.5)`,
              marginBottom: 18,
            }}
          >
            <span style={{ fontFamily: fonts.display, fontWeight: 900, color: "#fff", fontSize: 42 }}>
              Æ
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: fonts.display,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: colors.textPrimary,
            }}
          >
            AEOForge
          </h1>

          <div
            style={{
              marginTop: 8,
              fontSize: 24,
              color: colors.textSecondary,
              fontWeight: 500,
            }}
          >
            The Open-Source Web Agent-Readiness Platform
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 44,
            opacity: pillsSpring,
            transform: `translateY(${interpolate(pillsSpring, [0, 1], [25, 0])}px)`,
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.12)",
              border: `1px solid rgba(16, 185, 129, 0.3)`,
              color: colors.signalSuccess,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ● Meta Llama 3.2 · 7ms Local Inference
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(59, 130, 246, 0.12)",
              border: `1px solid rgba(59, 130, 246, 0.3)`,
              color: colors.accent,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ● Zero API Bills · $0.00 Cost
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(168, 85, 247, 0.12)",
              border: `1px solid rgba(168, 85, 247, 0.3)`,
              color: colors.signalPurple,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ● Universal Native MCP Tools
          </div>
        </div>

        {/* Terminal Clone Command Box */}
        <div
          style={{
            width: 840,
            borderRadius: 18,
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.borderMedium}`,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: terminalSpring,
            transform: `translateY(${interpolate(terminalSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: colors.signalSuccess, fontFamily: fonts.mono, fontSize: 18, fontWeight: 700 }}>
              $
            </span>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 19,
                color: colors.textPrimary,
                fontWeight: 600,
              }}
            >
              git clone https://github.com/Aryanban/aeoforge
            </span>
          </div>

          <div
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: colors.accent,
              color: colors.onAccent,
              fontFamily: fonts.mono,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            COPY
          </div>
        </div>

        {/* Subtitle Credential */}
        <div
          style={{
            marginTop: 36,
            fontFamily: fonts.mono,
            fontSize: 14,
            color: colors.textTertiary,
            opacity: footerSpring,
          }}
        >
          Built for Meta Global AI Developer Hackathon 2026 · Licensed under MIT
        </div>
      </div>

      <Vignette strength={0.25} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
