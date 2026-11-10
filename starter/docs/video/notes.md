# AEOForge Motion Graphics Demo Video — Production Notes & Decisions

## Wave 1: Initial Architecture & Foundation
- **Date:** 2026-11-10
- **Base Scaffold:** Adapted from `saas-product-demo-video` Remotion scaffold.
- **Audio Grid:** Synthesized 120 BPM dark-electronic soundtrack (`sfx/track.wav`), 20.0s duration (600 frames @ 30 FPS).
- **Beat Grid Reliability:** Rated `good` with 0.0 tracker lag and uniform 15-frame beat intervals.
- **Biggest Lift Beat:** Beat 22 (master frame 330) identified as the primary drop/impact of the piece.

---

## Decisions Log

### D1: Single Accent Color Strategy
- **Decision:** Keep the background obsidian dark (`#08080a`) and use Meta Blue (`#3b82f6`) as the primary interactive accent for navigation and audit actions.
- **Why:** Avoids the "Canva / generic AI template" multi-color glow look. Color accents are strictly functional:
  - Meta Blue (`#3b82f6`): Active focus, URL input, button clicks.
  - Emerald (`#10b981`): 100/100 score resolution, 7ms local inference, successful remediation.
  - Amber (`#f59e0b`): Warning / optimization required, `llms.txt` protocol.
  - Rose (`#f43f5e`): Coordinate tags `[1..10]`, Set-of-Marks reticle, navigation traps.

### D2: Authentic Asset Grounding
- **Decision:** Do not create hypothetical fantasy dashboards. Directly utilize the real `cerebralvalley.ai` audit scenario, the authentic AEOForge 4-pillar score breakdown (Citability 18/25, Navigability 17.5/25, Protocols 22/25, Structured Data 15/25), and authentic OmniParser v2 sub-pixel coordinates (`cx: 642, cy: 38`).
- **Why:** Grounding the video in actual product performance builds immediate credibility for technical judges and developers.

### D3: Beat 22 Bass Drop Payoff Alignment
- **Decision:** Align Scene 4 (`astPayoff`) to start on frame 330 (Beat 22) rather than an odd backbeat.
- **Why:** Beat 22 is the climax and heaviest bass drop of the track. Cutting the 0.28ms AST self-healing transformation directly on the drop delivers an unmistakable kinetic punch.

### D4: Word Count & Text Density
- **Measurement:** 30 visible words across all scenes, 1.50 words/second (ceiling is 4.5 words/second).
- **Why:** Preserves negative space, prevents text clipping, and lets the visual data speak.
