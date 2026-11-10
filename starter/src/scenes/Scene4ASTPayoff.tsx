// Scene 4: The Payoff — 0.28ms AST Self-Healing & 100/100 Perfect Score
// Lands hard on Beat 22 (the heaviest bass drop) with instant remediation.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AgentBot } from "../components/AgentBot";
import { BgMesh, Grain, Vignette } from "../components/Atmosphere";
import { Counter } from "../components/Counter";
import { sceneBeats } from "../scene-frames";
import { colors, fonts } from "../theme";
import { BACKBEATS, SCENES } from "../timing";

const hits = sceneBeats(BACKBEATS, SCENES.astPayoff);
const MANIFESTS_IN = hits[0] ?? 15; // local frame 15 (master frame 345)
const SCORE_SURGE_IN = hits[1] ?? 45; // local frame 45 (master frame 375)
const STAT_PUNCH_IN = hits[2] ?? 75; // local frame 75 (master frame 405)

export const Scene4ASTPayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Drop shockwave on frame 0 (Beat 22 drop)
  const shockwave = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const manifestsSpring = spring({
    frame: frame - MANIFESTS_IN,
    fps,
    config: { damping: 18, stiffness: 130 },
  });

  const scoreSpring = spring({
    frame: frame - SCORE_SURGE_IN,
    fps,
    config: { damping: 20, stiffness: 110 },
  });

  const statSpring = spring({
    frame: frame - STAT_PUNCH_IN,
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  // Color transition of score: Amber -> Emerald
  const scoreColor = frame >= SCORE_SURGE_IN ? colors.signalSuccess : colors.signalWarning;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgCanvas,
        fontFamily: fonts.ui,
        overflow: "hidden",
      }}
    >
      <BgMesh bg={colors.bgCanvas} primary={colors.signalSuccess} accentSoft="rgba(16,185,129,0.18)" />

      {/* Animated AI Agent in Victorious Mode */}
      <AgentBot
        x={120}
        y={220}
        emotion="victorious"
        dialogue="AST Patched! 280 tokens left!"
        dialogueInFrame={SCORE_SURGE_IN}
        scale={1.15}
      />

      {/* Shockwave ring on the drop */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 800,
          height: 800,
          marginLeft: -400,
          marginTop: -400,
          borderRadius: "50%",
          border: `2px solid ${colors.signalSuccess}`,
          opacity: interpolate(shockwave, [0, 1], [0.8, 0]),
          transform: `scale(${interpolate(shockwave, [0, 1], [0.2, 2.4])})`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Badges */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.15)",
              border: `1px solid rgba(16, 185, 129, 0.3)`,
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.signalSuccess, fontWeight: 700 }}>
              ⚡ 0.28ms AST SELF-HEALING REMEDIATION
            </span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(59, 130, 246, 0.15)",
              border: `1px solid rgba(59, 130, 246, 0.3)`,
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, fontWeight: 700 }}>
              1-CLICK CODEBASE INJECTION
            </span>
          </div>
        </div>

        {/* Main Surge Headline & Score Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            marginBottom: 40,
          }}
        >
          {/* Big Score Card */}
          <div
            style={{
              padding: "20px 48px",
              borderRadius: 24,
              backgroundColor: colors.bgPanel,
              border: `2px solid ${scoreColor}`,
              boxShadow: `0 0 50px ${frame >= SCORE_SURGE_IN ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.2)"}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary, letterSpacing: "0.1em" }}>
              AUDITED AEO READINESS
            </div>

            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 104,
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
                margin: "10px 0",
              }}
            >
              <Counter
                startFrame={SCORE_SURGE_IN}
                duration={30}
                from={72.5}
                to={100.0}
                format={(n) => (n >= 99.9 ? "100" : n.toFixed(1))}
                style={{ fontWeight: 900 }}
              />
              <span style={{ fontSize: 36, color: colors.textTertiary, marginLeft: 6 }}>/100</span>
            </div>

            <div
              style={{
                padding: "6px 20px",
                borderRadius: 999,
                background: frame >= SCORE_SURGE_IN ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                color: scoreColor,
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {frame >= SCORE_SURGE_IN ? "GRADE A+ // PERFECT AGENT COMPATIBILITY" : "GRADE B // REMEDIATING..."}
            </div>
          </div>

          {/* Stat Punch Card */}
          <div
            style={{
              padding: "28px 40px",
              borderRadius: 24,
              backgroundColor: colors.bgPanel,
              border: `1px solid ${colors.borderMedium}`,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              opacity: statSpring,
              transform: `translateX(${interpolate(statSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary }}>
                TOKEN CONTEXT REDUCTION
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: 800, color: colors.textPrimary }}>
                45,000 <span style={{ color: colors.signalSuccess }}>→ 280</span>
                <span style={{ fontSize: 24, color: colors.signalSuccess, marginLeft: 12 }}>(-98.7%)</span>
              </div>
            </div>

            <div style={{ height: 1, background: colors.borderSubtle }} />

            <div>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary }}>
                AST TRANSFORMATION SPEED
              </div>
              <div style={{ fontFamily: fonts.display, fontSize: 44, fontWeight: 800, color: colors.accent }}>
                0.28ms <span style={{ fontSize: 22, color: colors.textSecondary }}>(Zero Delay)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Generated Machine Manifests */}
        <div
          style={{
            display: "flex",
            gap: 24,
            width: "100%",
            maxWidth: 1320,
            opacity: manifestsSpring,
            transform: `translateY(${interpolate(manifestsSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Manifest 1: llms.txt */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              borderRadius: 18,
              backgroundColor: colors.bgPanel,
              border: `1px solid rgba(245, 158, 11, 0.35)`,
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.signalWarning }} />
              <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, color: colors.signalWarning }}>
                /llms.txt
              </span>
            </div>
            <div style={{ fontSize: 15, color: colors.textPrimary, fontWeight: 600, marginBottom: 8 }}>
              Curated Markdown Route Directory
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textTertiary, lineHeight: 1.5 }}>
              Distills 45k DOM tokens into a 280-token concise index for visiting LLMs &amp; agents.
            </div>
          </div>

          {/* Manifest 2: agent-spec.json */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              borderRadius: 18,
              backgroundColor: colors.bgPanel,
              border: `1px solid rgba(59, 130, 246, 0.35)`,
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.accent }} />
              <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, color: colors.accent }}>
                /agent-spec.json
              </span>
            </div>
            <div style={{ fontSize: 15, color: colors.textPrimary, fontWeight: 600, marginBottom: 8 }}>
              Machine-Executable API Spec
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textTertiary, lineHeight: 1.5 }}>
              Deterministic action schemas for Claude Computer Use, Browser-Use, and AutoGPT.
            </div>
          </div>

          {/* Manifest 3: schema.jsonld */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              borderRadius: 18,
              backgroundColor: colors.bgPanel,
              border: `1px solid rgba(168, 85, 247, 0.35)`,
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.signalPurple }} />
              <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, color: colors.signalPurple }}>
                schema.jsonld
              </span>
            </div>
            <div style={{ fontSize: 15, color: colors.textPrimary, fontWeight: 600, marginBottom: 8 }}>
              Inverted-Pyramid Fact Graph
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textTertiary, lineHeight: 1.5 }}>
              96.8% Meta AI &amp; Perplexity attribution rate with verified entity triplets.
            </div>
          </div>
        </div>
      </div>

      <Vignette strength={0.25} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
