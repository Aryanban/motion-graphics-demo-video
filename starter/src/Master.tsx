// Master - the 16:9 film: the soundtrack plus one <Sequence> per scene.
//
// Every `from` and `durationInFrames` comes from SCENES in timing.ts.

import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SOUNDS, Sfx } from "./components/Sfx";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2AuditHUD } from "./scenes/Scene2AuditHUD";
import { Scene3VisualSoM } from "./scenes/Scene3VisualSoM";
import { Scene4ASTPayoff } from "./scenes/Scene4ASTPayoff";
import { Scene5ClosingCTA } from "./scenes/Scene5ClosingCTA";
import { colors } from "./theme";
import { AUDIO_TRIM, MUSIC_VOLUME, SCENES, SOUNDTRACK, TOTAL_FRAMES } from "./timing";

const FADE_OUT_FRAMES = 18; // 0.6 s at 30 fps: reads as an outro without wasting the last beat

type Cue = { at: number; volume?: number } & ({ sound: keyof typeof SOUNDS } | { src: string; lead: number });
const CUES: Cue[] = [
  // Scene 1: Initial whoosh entrance
  { at: SCENES.hook.start, src: "sfx/whoosh.wav", lead: 0.07, volume: 0.3 },
  // Scene 2: Click on audit button + HUD pop
  { at: SCENES.auditHud.start + 30, src: "sfx/tick.wav", lead: 0.01, volume: 0.45 },
  { at: SCENES.auditHud.start + 60, src: "sfx/pop.wav", lead: 0.02, volume: 0.35 },
  // Scene 3: Reticle target lock
  { at: SCENES.visualSom.start + 30, src: "sfx/tick.wav", lead: 0.01, volume: 0.4 },
  // Scene 4: BASS DROP IMPACT on Beat 22 (frame 330)
  { at: SCENES.astPayoff.start, src: "sfx/bass.wav", lead: 0.02, volume: 0.6 },
  // Scene 5: Finale whoosh entrance
  { at: SCENES.closingCta.start, src: "sfx/whoosh.wav", lead: 0.07, volume: 0.35 },
];

/** The sound effects, one layer both masters share (MasterVertical renders it too). */
export const SoundLayer: React.FC<{ sfx?: boolean }> = ({ sfx = true }) =>
  !sfx ? null : (
    <>
      {CUES.map((c, i) =>
        "sound" in c ? (
          <Sfx key={i} at={c.at} sound={c.sound} volume={c.volume} />
        ) : (
          <Sfx key={i} at={c.at} src={staticFile(c.src)} lead={c.lead} volume={c.volume} />
        ),
      )}
    </>
  );

export const Master: React.FC<{ sfx?: boolean; music?: boolean }> = ({ sfx = true, music = true }) => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES],
    [MUSIC_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: colors.background }}>
      {SOUNDTRACK && music && (
        <Audio src={staticFile(SOUNDTRACK)} trimBefore={AUDIO_TRIM} volume={volume} />
      )}
      <SoundLayer sfx={sfx} />

      {/* Scene 1: The Hook (0 - 105) */}
      <Sequence from={SCENES.hook.start} durationInFrames={SCENES.hook.duration}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Autonomous Audit & 4-Pillar HUD (105 - 225) */}
      <Sequence from={SCENES.auditHud.start} durationInFrames={SCENES.auditHud.duration}>
        <Scene2AuditHUD />
      </Sequence>

      {/* Scene 3: Visual Perception & Set-of-Marks (225 - 330) */}
      <Sequence from={SCENES.visualSom.start} durationInFrames={SCENES.visualSom.duration}>
        <Scene3VisualSoM />
      </Sequence>

      {/* Scene 4: 0.28ms AST Self-Healing Payoff (330 - 465) */}
      <Sequence from={SCENES.astPayoff.start} durationInFrames={SCENES.astPayoff.duration}>
        <Scene4ASTPayoff />
      </Sequence>

      {/* Scene 5: Local Sovereignty & GitHub CTA (465 - 600) */}
      <Sequence from={SCENES.closingCta.start} durationInFrames={SCENES.closingCta.duration}>
        <Scene5ClosingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
