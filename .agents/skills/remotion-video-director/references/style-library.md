# Style library

Ten named looks, each a full spec: palette, type, shape, motion, texture, the parts it uses and its
rules. The data is `starter/src/styles/styles.json`; scenes read it through `getStyle(id, skin)` and
the parts in `starter/src/components/editorial/Editorial.tsx`. Every style renders the same sample
film as `Style-<id>` in Remotion Studio, so you can compare them on screen before choosing.

## Why this exists

Videos made without a chosen style all drift to one look: a dark background, gradient mesh, grain,
a blue glow and centred type. A style is chosen per brief so each video looks made for its subject.

## How to pick (do this every time, before any scene code)

1. **Read the brief and the material.** Write down what the video can show: real screens, footage,
   data, or nothing. A style that needs material you do not have is out (Photo Story needs footage).
2. **Deal three.** `cd starter && npm run style:pick -- "<the brief>" --material screens|footage|data|none`.
   The script scores signals in the brief and marks down the two most recently used styles
   (`docs/video/style-log.json`), so one style does not repeat across every video.
3. **Check against the design skills.** Load `frontend-design` (and `hallmark` for theme ideas if
   installed). Reject a pick that lands on their anti-patterns for this brief: purple-to-blue
   gradients, cream plus serif plus terracotta, near-black with one acid accent, identical rounded
   cards, tracked capital eyebrows. Say which of the three you chose and why in one line.
4. **Skin it with the brand.** If the product has its own tokens (CSS variables, a brand file), lay
   them over the style: `getStyle("editorial-paper", { colors: { marker: "#AECBFA", accent: "#1A73E8" }, fonts: { display: "Manrope" } })`.
   The skin changes colour and font only; structure, motion and rules stay the style's.
5. **Look before building.** Render `Style-<id>` stills (`node tools/stills.mjs Style-<id> 100 190 300 400 470`)
   and compare with the reference named in the style. Then record it:
   `npm run style:pick -- --use <id>`.
6. **Put it in the brief.** "Creative Direction" in the creative brief names the style id, the skin,
   and the style's rules, which every scene must follow.

If the user gives a reference video, break it down (palette, type, layout, motion, cuts) and match it
to the closest style; if none is close, add a new entry to `styles.json` rather than improvising
tokens inside scenes.

## The styles

| id | Feel | Pick for | Avoid for |
|---|---|---|---|
| `editorial-paper` | Paper, ink, one highlighter word, the real app tilted in | Hackathons, explainers, ML and data stories, civic tech | Nightlife, luxury |
| `drawing-sheet` | A drawing-set sheet: border, title block, dimension lines | Hardware, 3D scans, architecture, measurement | Consumer social |
| `keynote-black` | One idea per frame, huge type, long holds | Launches, teasers | Dense data, tutorials |
| `data-desk` | Navy desk, amber ticker, charts that draw | Reports, metrics, finance | Emotional stories |
| `terminal` | Monospace, typed commands, real output | CLIs, SDKs, APIs, infra | Non-technical viewers |
| `swiss-poster` | Strict grid, giant numerals, one red | Transit, conferences, design, public service | Cosy, kids |
| `riso-print` | Two inks overprinted, grain, misregistration | Community, education, indie, events | Enterprise security |
| `sticker-pop` | Thick outlines, hard shadows, bouncy fills | Consumer apps, reels, creators, 9:16 | Healthcare, legal |
| `photo-story` | Full-bleed footage, serif subtitles | Founder and customer stories | No footage |
| `dark-atmospheric` | Glow, glass, mesh, grain (this repo's AEOForge look) | AI, 3D, audio, night | Civic, data proof |

Full tokens are in `styles.json`. Per-style rules (for example "exactly one highlighted word per
headline") are in each entry's `rules` and are binding.

## Editorial Paper in detail (the reference look)

Taken from Basement Ready, the Meta AI developer hackathon winner
(youtube.com/watch?v=mFCAcvSXj48); its source is `blueprints/basement-ready/video`.

- **Frame:** flat paper `#F4F6F2`, ink `#0F2A1E`. No gradient, grain or vignette. Depth comes from
  the tilted browser frame and its long soft shadow.
- **Type:** Hanken Grotesk 800, tracking -0.045em, line height 0.92. Headlines are left aligned,
  5 to 8 words, end with a full stop, and one word sits on a highlighter block that wipes in from
  the left. Above them, a small mono kicker line (Geist Mono) in sentence case.
- **Parts:** `Kicker`, `Headline` with `mark`, `LineArt` (1.5 px strokes that draw in),
  `PillPipeline` (outlined pills and arrows; the active step fills with ink), `BrowserFrame`
  (the real product slides in from the right tilted 8 to 14 degrees and may run off the edge),
  `StampCard` (thick border, rotated about 2 degrees, stamps down), `NumberCard` (counts up; real
  numbers only), `Checklist`, `CaptionBar` (the voice line at the bottom), `CloseCard` (mark,
  wordmark, one button in the marker colour, address, small mono credits).
- **Motion:** ease-out `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `(0.65, 0, 0.35, 1)` for
  drawing. Entrances 14 frames, stagger 4. Hard cuts between scenes; no cross-dissolves.
- **Example skin:** the Delhi bus planner film used marker `#AECBFA`, accent `#1A73E8` and Manrope,
  taken from the app's own CSS.

## What the kit does not do yet

The parts carry each style's palette, type, borders, radii and shadows. Style textures (riso grain
and offset, the drawing-sheet border and title block, the Swiss grid overlay, Dark Atmospheric's
mesh) are built per film: `Sheet` and `Dim` in `blueprints/basement-ready/video/src/components/kit.tsx`
and `Atmosphere.tsx` in the starter are the starting points.
