// AgentBot.tsx — Animated AI Agent Protagonist for short-story motion graphics.
// Features expressive LED eyes, floating physics, thruster glow, and tech dialogue bubbles.

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

export type BotEmotion = "neutral" | "panicked" | "scanning" | "locked" | "victorious";

export interface AgentBotProps {
  x: number;
  y: number;
  emotion?: BotEmotion;
  dialogue?: string;
  dialogueInFrame?: number;
  scale?: number;
  flipX?: boolean;
}

export const AgentBot: React.FC<AgentBotProps> = ({
  x,
  y,
  emotion = "neutral",
  dialogue,
  dialogueInFrame = 0,
  scale = 1.0,
  flipX = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating hover motion
  const hoverY = Math.sin(frame / 6) * 7;
  const hoverTilt = Math.cos(frame / 8) * 3;

  // Dialogue bubble spring entrance
  const bubbleSpring = spring({
    frame: frame - dialogueInFrame,
    fps,
    config: { damping: 15, stiffness: 160 },
  });

  // LED Eye Expressions
  const getEyeExpression = () => {
    switch (emotion) {
      case "panicked":
        return { left: ">", right: "<", color: colors.signalDanger, glow: colors.signalDanger };
      case "scanning":
        return { left: "◉", right: "◉", color: colors.accent, glow: colors.accent };
      case "locked":
        return { left: "⌖", right: "⌖", color: colors.signalWarning, glow: colors.signalWarning };
      case "victorious":
        return { left: "★", right: "★", color: colors.signalSuccess, glow: colors.signalSuccess };
      case "neutral":
      default:
        return { left: "•", right: "•", color: "#38bdf8", glow: "#38bdf8" };
    }
  };

  const eyes = getEyeExpression();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + hoverY,
        transform: `scale(${scale}) rotate(${hoverTilt}deg) ${flipX ? "scaleX(-1)" : ""}`,
        transformOrigin: "center center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Speech / Dialogue Bubble */}
      {dialogue && (
        <div
          style={{
            position: "absolute",
            bottom: 105,
            left: flipX ? "auto" : 40,
            right: flipX ? 40 : "auto",
            transform: `scale(${bubbleSpring}) ${flipX ? "scaleX(-1)" : ""}`,
            transformOrigin: flipX ? "bottom right" : "bottom left",
            opacity: bubbleSpring,
            padding: "10px 18px",
            borderRadius: 14,
            background: "rgba(15, 15, 23, 0.95)",
            border: `1.5px solid ${eyes.color}`,
            boxShadow: `0 12px 30px rgba(0, 0, 0, 0.7), 0 0 15px ${eyes.glow}44`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
            zIndex: 110,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: eyes.color,
              boxShadow: `0 0 10px ${eyes.glow}`,
            }}
          />
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            {dialogue}
          </span>
        </div>
      )}

      {/* Thruster Glow underneath */}
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: -18,
          width: 32,
          height: 24,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${eyes.glow} 0%, transparent 75%)`,
          filter: "blur(6px)",
          opacity: 0.85 + Math.sin(frame / 3) * 0.2,
        }}
      />

      {/* Robot Chassis Body */}
      <div
        style={{
          width: 88,
          height: 82,
          borderRadius: 24,
          background: `linear-gradient(145deg, #1f2230, #0c0d13)`,
          border: `2px solid rgba(255, 255, 255, 0.15)`,
          boxShadow: `0 16px 40px rgba(0,0,0,0.8), 0 0 20px ${eyes.glow}33`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Antenna */}
        <div
          style={{
            position: "absolute",
            top: -12,
            width: 3,
            height: 12,
            background: "#64748b",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -6,
              left: -3.5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: eyes.color,
              boxShadow: `0 0 12px ${eyes.glow}`,
            }}
          />
        </div>

        {/* Visor Screen */}
        <div
          style={{
            width: 68,
            height: 44,
            borderRadius: 14,
            background: "#050608",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 8px",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle scanline */}
          <div
            style={{
              position: "absolute",
              top: (frame * 2) % 44,
              left: 0,
              right: 0,
              height: 2,
              background: "rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />

          {/* Left Eye */}
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 22,
              fontWeight: 900,
              color: eyes.color,
              textShadow: `0 0 12px ${eyes.glow}`,
              userSelect: "none",
            }}
          >
            {eyes.left}
          </span>

          {/* Right Eye */}
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 22,
              fontWeight: 900,
              color: eyes.color,
              textShadow: `0 0 12px ${eyes.glow}`,
              userSelect: "none",
            }}
          >
            {eyes.right}
          </span>
        </div>

        {/* Chest Badge / Core */}
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 18,
              height: 4,
              borderRadius: 2,
              background: eyes.color,
              opacity: 0.8,
            }}
          />
          <div
            style={{
              width: 6,
              height: 4,
              borderRadius: 2,
              background: "#475569",
            }}
          />
        </div>
      </div>
    </div>
  );
};
