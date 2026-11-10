// whisper-cue.ts - Voiceover-led timeline, Whisper word-cue lookup, bar-loop music
// drop alignment, and 5-tap audio ducking extracted cleanly from Dbar2/basement-ready.

import { interpolate } from "remotion";
import { easings } from "../easings";

/** Single Whisper word timestamp tuple: [text, startSec, endSec] in source audio time. */
export type WhisperWord = [string, number, number];

export interface VoiceSectionSpec {
  id: string;
  /** Start time (seconds) inside the continuous source voiceover file. */
  a: number;
  /** End time (seconds) inside the continuous source voiceover file. */
  b: number;
  /** Lead pause (seconds) inserted before this section starts speaking in the edit. */
  pause: number;
}

export interface ScheduledSection extends VoiceSectionSpec {
  /** Voice start time (seconds) in the final edit timeline. */
  start: number;
  /** Voice end time (seconds) in the final edit timeline. */
  end: number;
  /** Visual start time (seconds) of this section (including lead pause). */
  v0: number;
  /** Visual end time (seconds) of this section (up to next section or tail). */
  v1: number;
}

export interface MusicLoopConfig {
  /** Timestamp (seconds) of the musical drop inside the music file. */
  drop: number;
  /** Length of one musical bar (seconds). */
  bar: number;
  /** Number of bars before `drop` where a calm intro loop begins. */
  loopFromBars: number;
  /** Number of bars before `drop` where that calm intro loop jumps back. */
  loopToBars: number;
  /** Music linear gain when no voice is playing (0..1). */
  free: number;
  /** Music linear gain when ducked under narration (0..1). */
  under: number;
}

/** Build an edit timeline from ordered voiceover sections and an outro tail duration. */
export function buildTimeline(
  sections: VoiceSectionSpec[],
  tailSeconds: number,
  fps = 30,
): { secs: ScheduledSection[]; totalFrames: number } {
  let cursor = 0;
  const secs: ScheduledSection[] = sections.map((x) => {
    const start = cursor + x.pause;
    const end = start + (x.b - x.a);
    cursor = end;
    return { ...x, start, end, v0: start - x.pause, v1: 0 };
  });
  secs.forEach((x, i) => {
    x.v1 = i < secs.length - 1 ? secs[i + 1].v0 : x.end + tailSeconds;
  });
  const totalFrames = secs.length > 0 ? Math.round(secs[secs.length - 1].v1 * fps) : 0;
  return { secs, totalFrames };
}

/** Map a timestamp in the raw voiceover audio (seconds) to edit timeline seconds. */
export function editTimeOf(voiceSeconds: number, secs: ScheduledSection[]): number {
  const s = secs.find((x) => voiceSeconds >= x.a - 0.05 && voiceSeconds <= x.b + 0.3) ?? secs[0];
  if (!s) return voiceSeconds;
  return s.start + (voiceSeconds - s.a);
}

const normWord = (w: string) => w.replace(/[^\w']/g, "").toLowerCase();

/** Find the edit timeline frame where `phrase` starts, searching after `afterVoiceSec`. */
export function findPhraseFrame(
  words: WhisperWord[],
  phrase: string,
  secs: ScheduledSection[],
  fps = 30,
  afterVoiceSec = 0,
): number {
  const tokens = phrase.split(/\s+/).filter(Boolean).map(normWord);
  for (let i = 0; i < words.length; i++) {
    if (words[i][1] < afterVoiceSec) continue;
    if (tokens.every((tok, k) => words[i + k] && normWord(words[i + k][0]) === tok)) {
      return Math.round(editTimeOf(words[i][1], secs) * fps);
    }
  }
  throw new Error(`[whisper-cue] phrase not found: "${phrase}"`);
}

/** Compute bar-aligned pre-drop loop boundaries so a music drop lands on an exact speech cue. */
export function computeMusicLoop(music: MusicLoopConfig, dropEditSec: number) {
  const barAt = (k: number) => music.drop - k * music.bar;
  const loopA = barAt(music.loopFromBars);
  const loopB = barAt(music.loopToBars);
  const repeat = music.drop >= dropEditSec ? 0 : Math.max(0, loopB - loopA);
  const musicStartOffset = Math.max(0, music.drop + repeat - dropEditSec);
  const seamEditSec = Math.max(0, loopB - musicStartOffset);
  return { loopA, loopB, repeat, musicStartOffset, seamEditSec };
}

/** Smooth 5-tap audio ducking envelope that dips music under speech and fades edges. */
export function createDuckedMusicVolume(
  secs: ScheduledSection[],
  music: Pick<MusicLoopConfig, "free" | "under">,
  fps: number,
  totalFrames: number,
) {
  const isSpeaking = (t: number) => secs.some((s) => t >= s.start - 0.25 && t <= s.end + 0.35);
  return (frame: number): number => {
    const t = frame / fps;
    let taps = 0;
    for (const d of [-0.5, -0.25, 0, 0.25, 0.5]) {
      taps += isSpeaking(t + d) ? 1 : 0;
    }
    const underWeight = taps / 5;
    const level = music.free * (1 - underWeight) + music.under * underWeight;
    const fadeInFrames = Math.min(12, Math.max(1, Math.floor(totalFrames / 4)));
    const fadeOutStart = Math.max(fadeInFrames + 1, totalFrames - Math.round(fps * 2.5));
    const fadeOutEnd = Math.max(fadeOutStart + 1, totalFrames - 3);
    const envelope = interpolate(
      frame,
      [0, fadeInFrames, fadeOutStart, fadeOutEnd],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return level * envelope;
  };
}

/** Clamped 0->1 progress helper for frame intervals, defaulting to easings.slowInLand. */
export function prog(frame: number, start: number, dur: number, ease = easings.slowInLand): number {
  return interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}
