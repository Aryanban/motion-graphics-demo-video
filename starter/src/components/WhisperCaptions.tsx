// WhisperCaptions.tsx - Karaoke word-synced captions and kinetic highlight type,
// driven by Whisper word timestamps and whisper-cue.ts.
// Adapted from Dbar2/basement-ready (MIT) to read tokens from ../theme and ../easings.

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { easings } from "../easings";
import { editTimeOf, prog, type ScheduledSection, type WhisperWord } from "../lib/whisper-cue";
import { canvas, colors, fonts } from "../theme";

export interface TimedWord {
  t: string;
  s: number;
  e: number;
}

export interface CaptionChunk {
  words: TimedWord[];
  s: number;
  e: number;
}

/** Group raw Whisper word timestamps into readable subtitle phrases on punctuation or gaps. */
export function buildCaptionChunks(
  rawWords: WhisperWord[],
  secs: ScheduledSection[],
  fixes: Record<string, string> = {},
): CaptionChunk[] {
  const norm = (w: string) => w.replace(/[^\w']/g, "").toLowerCase();
  const words: TimedWord[] = rawWords
    .map(([w, s, e]) => {
      const k = norm(w);
      const t = fixes[k] ? w.replace(/[\w']+/, fixes[k]) : w;
      return { t, s: editTimeOf(s, secs), e: editTimeOf(e, secs) };
    })
    .filter((w) => Boolean(w.t));

  const out: CaptionChunk[] = [];
  let cur: TimedWord[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const end = /[.?!,]$/.test(w.t) && (cur.length >= 4 || /[.?!]$/.test(w.t));
    const gap = words[i + 1] ? words[i + 1].s - w.e > 0.5 : true;
    if (end || gap || cur.length >= 9) {
      out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
      cur = [];
    }
  });
  return out;
}

/** Word-by-word karaoke caption overlay synchronized to Whisper edit timestamps. */
export const KaraokeCaptions: React.FC<{
  chunks: CaptionChunk[];
  left?: number;
  bottom?: number;
  width?: number;
  color?: string;
}> = ({
  chunks,
  left = 60,
  bottom = 44,
  width = canvas.width - 720,
  color = colors.ink,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunk = chunks.find(
    (x, i) =>
      t >= x.s - 0.08 &&
      t < (chunks[i + 1] ? Math.min(chunks[i + 1].s - 0.08, x.e + 0.9) : x.e + 0.9),
  );
  if (!chunk) return null;
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 1.25,
        color,
      }}
    >
      {chunk.words.map((w, i) => {
        const on = prog(frame, Math.round(w.s * fps) - 3, 5);
        return (
          <span
            key={i}
            style={{
              opacity: 0.28 + 0.72 * on,
              display: "inline-block",
              transform: `translateY(${(1 - on) * 6}px)`,
              marginRight: "0.28em",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

/** Kinetic display words rising into view with an optional swept accent band behind `mark` index. */
export const PunchText: React.FC<{
  text: string;
  at: number;
  out?: number;
  x: number;
  y: number;
  size?: number;
  mark?: number;
  markColor?: string;
  width?: number;
  color?: string;
}> = ({
  text,
  at,
  out,
  x,
  y,
  size = 96,
  mark,
  markColor = colors.accentSoft,
  width = 900,
  color = colors.ink,
}) => {
  const frame = useCurrentFrame();
  const fade = out === undefined ? 1 : 1 - prog(frame, out, 8, easings.maskReveal);
  if (frame < at - 2 || fade <= 0) return null;
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.045em",
        lineHeight: 1.0,
        color,
        opacity: fade,
      }}
    >
      {words.map((w, i) => {
        const p = prog(frame, at + i * 3, 12, easings.slowInLand);
        const sweep = mark === i ? prog(frame, at + i * 3 + 8, 12, easings.slowInLand) : 0;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              overflow: "visible",
              marginRight: "0.22em",
              paddingBottom: size * 0.08,
            }}
          >
            {mark === i && (
              <span
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  top: size * 0.18,
                  bottom: size * 0.04,
                  background: markColor,
                  transformOrigin: "left",
                  transform: `scaleX(${sweep})`,
                  zIndex: 0,
                }}
              />
            )}
            <span
              style={{
                position: "relative",
                display: "inline-block",
                opacity: p,
                transform: `translateY(${(1 - p) * 40}%)`,
                zIndex: 1,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};
