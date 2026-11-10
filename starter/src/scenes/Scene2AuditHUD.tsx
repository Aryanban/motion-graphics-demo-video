// Scene 2: Autonomous Audit & 4-Pillar Telemetry HUD
// Real-time evaluation of cerebralvalley.ai with authentic 4-pillar scores.

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AgentBot } from "../components/AgentBot";
import { BgMesh, Grain, Vignette } from "../components/Atmosphere";
import { Counter } from "../components/Counter";
import { ClickRipple, Cursor, clickPath } from "../components/Cursor";
import { ZoomPunch } from "../components/ZoomPunch";
import { sceneBeats } from "../scene-frames";
import { colors, fonts } from "../theme";
import { BACKBEATS, SCENES } from "../timing";

const hits = sceneBeats(BACKBEATS, SCENES.auditHud);
const CLICK_FRAME = hits[1] ?? 30; // local frame 30 (master frame 135)
const HUD_IN = hits[2] ?? 60; // local frame 60 (master frame 165)
const TELEMETRY_IN = hits[3] ?? 90; // local frame 90 (master frame 195)

export const Scene2AuditHUD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Button geometry for cursor targeting
  const buttonPos = { x: 1260, y: 154 };

  const hudSpring = spring({
    frame: frame - HUD_IN,
    fps,
    config: { damping: 18, stiffness: 130 },
  });

  const telemetrySpring = spring({
    frame: frame - TELEMETRY_IN,
    fps,
    config: { damping: 20, stiffness: 140 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgCanvas,
        fontFamily: fonts.ui,
        overflow: "hidden",
      }}
    >
      <BgMesh bg={colors.bgCanvas} primary={colors.accent} accentSoft="rgba(59,130,246,0.14)" />

      {/* Animated AI Agent Companion in Scanning Mode */}
      <AgentBot
        x={1580}
        y={140}
        emotion="scanning"
        dialogue="Scanning 4-Pillar Matrix..."
        dialogueInFrame={HUD_IN}
        scale={1.1}
        flipX={true}
      />

      {/* Top Navigation & URL Audit Bar — Composed from frame 0 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 100,
          right: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Brand Lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${colors.accent}, #1d4ed8)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${colors.accentSoft}`,
            }}
          >
            <span style={{ fontFamily: fonts.display, fontWeight: 900, color: "#fff", fontSize: 20 }}>
              Æ
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: 22,
                color: colors.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              AEOForge Studio
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: "0.08em" }}>
              META LLAMA 3.2 RUNTIME
            </div>
          </div>
        </div>

        {/* Input Dock */}
        <div
          style={{
            flex: 1,
            maxWidth: 820,
            height: 60,
            borderRadius: 14,
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.borderMedium}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.signalSuccess, fontWeight: 700 }}>
            AUDIT_TARGET:
          </span>
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 17,
              color: colors.textPrimary,
              fontWeight: 500,
              flex: 1,
            }}
          >
            https://cerebralvalley.ai
          </span>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(16, 185, 129, 0.15)",
              color: colors.signalSuccess,
              fontFamily: fonts.mono,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            200 OK
          </div>
        </div>

        {/* Action Button with ZoomPunch on Click */}
        <ZoomPunch start={CLICK_FRAME} peak={CLICK_FRAME + 2} end={CLICK_FRAME + 5} peakScale={1.06}>
          <div
            style={{
              width: 250,
              height: 60,
              borderRadius: 14,
              backgroundColor: colors.accent,
              color: colors.onAccent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 17,
              boxShadow: `0 8px 24px rgba(59, 130, 246, 0.45)`,
              letterSpacing: "-0.01em",
            }}
          >
            Audit Agent Readiness
          </div>
        </ZoomPunch>
      </div>

      {/* Main 4-Pillar Telemetry Grid */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 100,
          right: 100,
          bottom: 120,
          display: "flex",
          gap: 32,
          opacity: hudSpring,
          transform: `translateY(${interpolate(hudSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        {/* Left Card: Overall Score */}
        <div
          style={{
            width: 480,
            borderRadius: 24,
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.borderMedium}`,
            padding: 40,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 13,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.textSecondary,
              marginBottom: 16,
            }}
          >
            AEO Readiness Index
          </div>

          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 112,
              fontWeight: 800,
              color: colors.signalWarning,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <Counter
              startFrame={HUD_IN}
              duration={30}
              from={0}
              to={72.5}
              format={(n) => n.toFixed(1)}
              style={{ fontWeight: 800 }}
            />
            <span style={{ fontSize: 36, color: colors.textTertiary, marginLeft: 8 }}>/100</span>
          </div>

          <div
            style={{
              marginTop: 18,
              padding: "6px 20px",
              borderRadius: 999,
              background: "rgba(245, 158, 11, 0.15)",
              border: `1px solid rgba(245, 158, 11, 0.3)`,
              color: colors.signalWarning,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.04em",
            }}
          >
            GRADE B // OPTIMIZATION REQUIRED
          </div>

          <div
            style={{
              marginTop: 28,
              fontFamily: fonts.mono,
              fontSize: 13,
              color: colors.textTertiary,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Agent scraping efficiency at 31.8% · Missing machine-readable manifests
          </div>
        </div>

        {/* Right Card: The 4 Strategic Pillars */}
        <div
          style={{
            flex: 1,
            borderRadius: 24,
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.borderMedium}`,
            padding: "36px 44px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${colors.borderSubtle}`,
              paddingBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: 22,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              4-Pillar Evaluation Matrix
            </span>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: colors.accent,
                fontWeight: 600,
              }}
            >
              MAX 25.0 PTS / PILLAR
            </span>
          </div>

          {/* Pillar 1 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>
                1. AI Citability &amp; Fact Attribution
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.signalSuccess, fontWeight: 700 }}>
                18.0 / 25
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(18.0 / 25) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.signalSuccess})`,
                  borderRadius: 5,
                }}
              />
            </div>
          </div>

          {/* Pillar 2 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>
                2. Agent Navigability (Set-of-Marks)
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.signalWarning, fontWeight: 700 }}>
                17.5 / 25
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(17.5 / 25) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.signalWarning})`,
                  borderRadius: 5,
                }}
              />
            </div>
          </div>

          {/* Pillar 3 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>
                3. Protocol Conformance (llms.txt)
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.signalWarning, fontWeight: 700 }}>
                22.0 / 25
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(22.0 / 25) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.signalWarning})`,
                  borderRadius: 5,
                }}
              />
            </div>
          </div>

          {/* Pillar 4 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>
                4. Structured Data (Schema.org Graph)
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 16, color: colors.signalDanger, fontWeight: 700 }}>
                15.0 / 25
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(15.0 / 25) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${colors.accent}, ${colors.signalDanger})`,
                  borderRadius: 5,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 100,
          right: 100,
          height: 52,
          borderRadius: 14,
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 30px",
          opacity: telemetrySpring,
          transform: `translateY(${interpolate(telemetrySpring, [0, 1], [15, 0])}px)`,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.textSecondary }}>
          ⚡ <strong style={{ color: colors.textPrimary }}>Crawl Latency:</strong> 0.86s (Turbo Route Interceptor)
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.textSecondary }}>
          📉 <strong style={{ color: colors.textPrimary }}>Bandwidth:</strong> -82% Network Reduction
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.signalWarning }}>
          ⚠️ <strong style={{ color: colors.signalWarning }}>Traps Detected:</strong> 4 Modal Overlays Flagged
        </span>
      </div>

      {/* Cursor interaction */}
      <Cursor
        fill={colors.accent}
        keypoints={clickPath(
          { frame: 0, x: width * 0.85, y: height * 0.7 },
          [{ frame: CLICK_FRAME, x: buttonPos.x, y: buttonPos.y }],
        )}
      />
      <ClickRipple clickFrame={CLICK_FRAME} x={buttonPos.x} y={buttonPos.y} color={colors.accent} />

      <Vignette strength={0.25} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
