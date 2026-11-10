// theme.ts - AEOForge authentic brand tokens: colors, fonts, canvas size.

export const colors = {
  // Brand & canvas
  bgCanvas: "#08080a",
  bgPanel: "#0f0f13",
  bgSurface: "#15151c",
  bgSurfaceElevated: "#1e1e27",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  borderMedium: "rgba(255, 255, 255, 0.16)",

  // Typography
  textPrimary: "#fcfcfd",
  textSecondary: "#9496a1",
  textTertiary: "#5a5c66",

  // Accents & Telemetry signals
  accent: "#3b82f6", // Meta Blue
  accentSoft: "rgba(59, 130, 246, 0.18)",
  onAccent: "#FFFFFF",
  signalSuccess: "#10b981", // Emerald (Grade A+, 100/100, local M4)
  signalWarning: "#f59e0b", // Amber (Protocols, llms.txt)
  signalPurple: "#a855f7", // Purple (Schema.org JSON-LD)
  signalDanger: "#f43f5e", // Rose (Set-of-Mark numbered badges, traps)

  // Scaffold compatibility aliases
  background: "#08080a",
  surface: "#0f0f13",
  ink: "#fcfcfd",
  inkSoft: "#9496a1",
  inkMuted: "#6b7280",
  border: "rgba(255, 255, 255, 0.08)",
  shadowTint: "rgba(59, 130, 246, 0.25)",

  // Light polarity (Porcelain mode payoff)
  lightCanvas: "#f8fafc",
  lightSurface: "#ffffff",
  lightInk: "#0f172a",
} as const;

export const fonts = {
  display: "Plus Jakarta Sans, system-ui, sans-serif",
  ui: "Plus Jakarta Sans, system-ui, sans-serif",
  mono: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace",
  editorial: "Roboto Slab, Georgia, serif",
} as const;

export const canvas = { width: 1920, height: 1080 } as const;
export const canvasVertical = { width: 1080, height: 1920 } as const;

/** Blend two #rrggbb colors; t = 0 gives a, t = 1 gives b. */
export const blendHex = (a: string, b: string, t: number): string => {
  const channels = (hex: string) =>
    [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((h) => parseInt(h, 16));
  const [ar, ag, ab] = channels(a);
  const [br, bg, bb] = channels(b);
  return `#${[ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]
    .map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0"))
    .join("")}`;
};
