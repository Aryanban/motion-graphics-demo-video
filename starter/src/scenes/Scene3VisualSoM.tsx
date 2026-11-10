// Scene 3: Visual Perception & Set-of-Marks (SoM) Grounding
// Shows OmniParser v2 sub-pixel centroid coordinates locking onto real interactive targets.

import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AgentBot } from "../components/AgentBot";
import { BgMesh, Grain, Vignette } from "../components/Atmosphere";
import { sceneBeats } from "../scene-frames";
import { colors, fonts } from "../theme";
import { BACKBEATS, SCENES } from "../timing";

const hits = sceneBeats(BACKBEATS, SCENES.visualSom);
const BADGES_IN = hits[0] ?? 0;
const RETICLE_IN = hits[1] ?? 30; // local frame 30
const LOCK_IN = hits[2] ?? 60; // local frame 60
const SURGE_IN = hits[3] ?? 90; // local frame 90

// Real Set-of-Mark coordinate targets
const SOM_MARKS = [
  { id: 1, label: "Logo Home", x: 160, y: 190 },
  { id: 2, label: "Find Events", x: 642, y: 190, target: true },
  { id: 3, label: "Communities", x: 790, y: 190 },
  { id: 4, label: "Host Event", x: 925, y: 190 },
  { id: 5, label: "Search City", x: 480, y: 395 },
  { id: 6, label: "Featured Summit", x: 480, y: 550 },
  { id: 7, label: "Register Badge", x: 890, y: 550 },
  { id: 8, label: "Speaker Roster", x: 1250, y: 440 },
  { id: 9, label: "Sponsor Pitch", x: 1250, y: 620 },
  { id: 10, label: "Footer Docs", x: 640, y: 880 },
];

export const Scene3VisualSoM: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Camera pushes in slightly towards badge [2]
  const zoom = interpolate(frame, [0, SCENES.visualSom.duration], [1.0, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panX = interpolate(frame, [0, SCENES.visualSom.duration], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const reticleProgress = spring({
    frame: frame - RETICLE_IN,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const lockProgress = spring({
    frame: frame - LOCK_IN,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgCanvas,
        fontFamily: fonts.ui,
        overflow: "hidden",
      }}
    >
      <BgMesh bg={colors.bgCanvas} primary={colors.signalDanger} accentSoft="rgba(244,63,94,0.15)" />

      {/* Animated AI Agent Locking Sub-pixel Coordinates */}
      <AgentBot
        x={360}
        y={120}
        emotion="locked"
        dialogue="Target locked: [2] Find Events!"
        dialogueInFrame={LOCK_IN}
        scale={1.1}
      />

      {/* Main Viewport Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${zoom}) translateX(${panX}px)`,
          transformOrigin: "642px 190px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            width: 1480,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(244, 63, 94, 0.15)",
                border: `1px solid rgba(244, 63, 94, 0.3)`,
                color: colors.signalDanger,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              SET-OF-MARKS (SoM) PERCEPTION
            </span>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary }}>
              OmniParser v2 Grounding Engine
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.signalSuccess }}>
              ● 99.8% Centroid Precision
            </span>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary }}>
              Target: cerebralvalley.ai
            </span>
          </div>
        </div>

        {/* Browser Frame */}
        <div
          style={{
            width: 1480,
            height: 800,
            borderRadius: 20,
            backgroundColor: "#0d0d12",
            border: `1px solid ${colors.borderMedium}`,
            boxShadow: "0 28px 80px rgba(0,0,0,0.8)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Browser Chrome Header */}
          <div
            style={{
              height: 48,
              backgroundColor: "#16161f",
              borderBottom: `1px solid ${colors.borderSubtle}`,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981" }} />
            </div>

            <div
              style={{
                flex: 1,
                maxWidth: 620,
                height: 30,
                borderRadius: 6,
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              🔒 https://cerebralvalley.ai/events
            </div>
          </div>

          {/* Web Viewport Content Simulation with authentic UI elements */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 752,
              backgroundColor: "#07070a",
              overflow: "hidden",
            }}
          >
            {/* Embedded screenshot preview layer as texture */}
            <Img
              src={staticFile("aeoforge-studio-preview.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.28,
                filter: "contrast(1.1) brightness(0.6)",
              }}
            />

            {/* Set of Mark Badges overlaid */}
            {SOM_MARKS.map((mark, i) => {
              const markSpring = spring({
                frame: frame - (BADGES_IN + i * 2),
                fps,
                config: { damping: 15, stiffness: 220 },
              });

              const isTarget = mark.target;

              return (
                <div
                  key={mark.id}
                  style={{
                    position: "absolute",
                    left: mark.x,
                    top: mark.y - 120, // offset into browser content area
                    opacity: markSpring,
                    transform: `scale(${interpolate(markSpring, [0, 1], [0.4, 1])})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    zIndex: isTarget ? 30 : 10,
                  }}
                >
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: isTarget ? colors.signalDanger : "rgba(244, 63, 94, 0.85)",
                      color: "#fff",
                      fontFamily: fonts.mono,
                      fontWeight: 800,
                      fontSize: 14,
                      boxShadow: isTarget ? "0 0 20px rgba(244, 63, 94, 0.8)" : "0 2px 8px rgba(0,0,0,0.4)",
                      border: "1px solid #fff",
                    }}
                  >
                    [{mark.id}]
                  </div>

                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 11,
                      color: "#fff",
                      background: "rgba(0,0,0,0.75)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mark.label}
                  </span>
                </div>
              );
            })}

            {/* Sub-Pixel Reticle Locking on Badge [2] */}
            <div
              style={{
                position: "absolute",
                left: 642,
                top: 190 - 120,
                width: 90,
                height: 90,
                marginLeft: -35,
                marginTop: -35,
                opacity: reticleProgress,
                transform: `scale(${interpolate(reticleProgress, [0, 1], [2.2, 1])})`,
                pointerEvents: "none",
                zIndex: 40,
              }}
            >
              {/* Radar sweep / circle */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: `2px solid ${colors.signalDanger}`,
                  boxShadow: `0 0 25px ${colors.signalDanger}`,
                  boxSizing: "border-box",
                }}
              />
              {/* Crosshairs */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -8,
                  bottom: -8,
                  width: 2,
                  marginLeft: -1,
                  background: colors.signalDanger,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: -8,
                  right: -8,
                  height: 2,
                  marginTop: -1,
                  background: colors.signalDanger,
                }}
              />
            </div>

            {/* Coordinate Readout HUD Box */}
            <div
              style={{
                position: "absolute",
                left: 730,
                top: 190 - 100,
                padding: "12px 18px",
                borderRadius: 12,
                background: "rgba(15, 15, 19, 0.95)",
                border: `1px solid ${colors.borderMedium}`,
                boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
                opacity: lockProgress,
                transform: `translateX(${interpolate(lockProgress, [0, 1], [20, 0])}px)`,
                zIndex: 50,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  color: colors.signalDanger,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                TARGET_LOCKED // [2] Find Events
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 14, color: "#fff", fontWeight: 600 }}>
                cx: 642.50px · cy: 70.25px
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: colors.signalSuccess,
                  fontWeight: 600,
                }}
              >
                ● No Obstruction · Zero Trap Collision
              </div>
            </div>
          </div>
        </div>
      </div>

      <Vignette strength={0.3} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
