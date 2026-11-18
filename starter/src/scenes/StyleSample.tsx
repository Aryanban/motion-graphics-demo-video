// StyleSample - one short film built only from the editorial kit, rendered in any style.
// Root registers it once per style (Style-<id>) so the styles can be compared side by side:
//   node tools/stills.mjs Style-editorial-paper ... or npm run style:sheet
// Numbers shown are facts about this repo, not invented metrics.

import React from "react";
import { Sequence } from "remotion";
import {
  BrowserFrame, CaptionBar, Checklist, CloseCard, Headline, Kicker, LineArt, NumberCard, Paper, PillPipeline, StampCard, StyleProvider, useStyle,
} from "../components/editorial/Editorial";
import { STYLES, getStyle, loadStyleFonts } from "../styles";


export const STYLE_SAMPLE_FRAMES = 480;

// A film frame with a play mark: 1.5 px line art.
const FILM = [
  "M10 20 H190 V140 H10 Z",
  "M10 40 H190 M10 120 H190",
  "M30 20 V40 M60 20 V40 M90 20 V40 M120 20 V40 M150 20 V40 M30 120 V140 M60 120 V140 M90 120 V140 M120 120 V140 M150 120 V140",
  "M88 64 L118 80 L88 96 Z",
];

const Mark: React.FC = () => {
  const s = useStyle();
  return (
    <svg width={96} height={96} viewBox="0 0 64 64" aria-hidden>
      <rect x="6" y="12" width="52" height="40" fill="none" stroke={s.colors.ink} strokeWidth="4" />
      <path d="M26 22 L42 32 L26 42 Z" fill={s.colors.ink} />
    </svg>
  );
};

const Film: React.FC = () => (
  <Paper>
    <Sequence durationInFrames={110}>
      <div style={{ position: "absolute", left: 112, top: 150, right: 112 }}>
        <Kicker text="Motion graphics studio, style library" />
        <Headline text="Pick a style, not a template." mark="style" at={6} style={{ marginTop: 28, maxWidth: 1250 }} />
      </div>
      <div style={{ position: "absolute", right: 150, top: 560 }}>
        <LineArt d={FILM} viewBox="0 0 200 160" width={420} at={20} />
      </div>
      <CaptionBar text="Every video starts by choosing a look that fits the brief." at={8} />
    </Sequence>

    <Sequence from={110} durationInFrames={90}>
      <div style={{ position: "absolute", left: 112, top: 150, right: 112 }}>
        <Kicker text="The flow" />
        <Headline text="Brief first. Then the look." mark="look" size={104} style={{ marginTop: 24 }} />
        <div style={{ marginTop: 90 }}>
          <PillPipeline steps={["Brief", "Pick style", "Build", "Check stills", "Render"]} active={1} at={10} />
        </div>
      </div>
      <CaptionBar text="The picker reads the brief and deals three styles that fit it." />
    </Sequence>

    <Sequence from={200} durationInFrames={120}>
      <div style={{ position: "absolute", left: 112, top: 120, width: 760 }}>
        <Kicker text="The product is the hero" />
        <Headline text="Show the real screen." mark="real" size={104} style={{ marginTop: 24 }} />
      </div>
      <BrowserFrame src="aeoforge-studio-preview.png" url="localhost:3000" x={880} y={150} w={1240} at={8} />
      <div style={{ position: "absolute", left: 140, top: 640 }}>
        <StampCard text="No mock screens." at={40} />
      </div>
      <CaptionBar text="Record the app with Playwright, then frame it in the style." />
    </Sequence>

    <Sequence from={320} durationInFrames={90}>
      <div style={{ position: "absolute", left: 112, top: 120, right: 112 }}>
        <Kicker text="What ships in this repo" />
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 32 }}>
          <NumberCard value={STYLES.length} label="styles in the library" at={4} emphasis />
          <NumberCard value={81} label="drop-in templates" at={10} />
          <NumberCard value={4} label="agent skills" at={16} />
        </div>
        <div style={{ marginTop: 56 }}>
          <Checklist items={["Tokens from one file", "Brand skin keeps the structure", "Design skills check for generic looks"]} at={24} />
        </div>
      </div>
    </Sequence>

    <Sequence from={410} durationInFrames={70}>
      <CloseCard mark={<Mark />} name="Motion studio" cta="Pick a style" url="npm run style:pick" credits={["Editorial Paper after Basement Ready (mFCAcvSXj48)"]} />
    </Sequence>
  </Paper>
);

export const StyleSample: React.FC<{ styleId: string }> = ({ styleId }) => {
  const style = getStyle(styleId);
  loadStyleFonts(style); // only this style's fonts; repeat calls are no-ops
  return (
    <StyleProvider style={style}>
      <Film />
    </StyleProvider>
  );
};
