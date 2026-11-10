# Third-Party Notices & Upstream Attributions

This repository integrates tools, agent skills, templates, and reference blueprints from six upstream open-source repositories. Each upstream component retains its original copyright and license terms.

| Upstream Repository | URL | Pinned Commit | License | Integration Location |
|---|---|---|---|---|
| `Dbar2/basement-ready` | https://github.com/Dbar2/basement-ready | `b443d86` | MIT (`Copyright (c) 2026 David Barry`) | `blueprints/basement-ready/`, adapted utilities in `starter/src/lib/whisper-cue.ts`, `starter/src/components/DrawingSheet.tsx`, `starter/src/components/WhisperCaptions.tsx`, `starter/src/components/Atmosphere.tsx`, `starter/tools/finish.sh`, `starter/tools/record/`, `starter/tools/capture-3d/`, and `starter/tools/audio/voice-*.py` |
| `noamdorr/saas-product-demo-video` | https://github.com/noamdorr/saas-product-demo-video | `c93c00f` (`v2.2.0`) | MIT (`Copyright (c) 2026 Noam Dorr`) | `.agents/skills/saas-product-demo-video/`, `blueprints/saas-product-demo-video/`, `starter/` core scaffold, `starter/src/components/`, `starter/docs/prompts/`, `starter/tools/mb/`, `starter/tools/qa/`, `starter/tools/audio/` |
| `remotion-dev/skills` | https://github.com/remotion-dev/skills | `1af7e69` (`v4.0.542`) | Remotion License (`https://www.remotion.dev/docs/license`) | `.agents/skills/remotion-best-practices/` |
| `BayramAnnakov/remotion-video-director` | https://github.com/BayramAnnakov/remotion-video-director | `c16a3a0` | MIT (`README.md`) | `.agents/skills/remotion-video-director/` |
| `haidrrrry/claude-remotion-skill` | https://github.com/haidrrrry/claude-remotion-skill | `1dcbe5e` | MIT (`Copyright (c) 2025 haidrrrry`) | `.agents/skills/remotion-motion-graphics/`, `templates/claude-remotion-examples/`, `starter/tools/audio/gen-sfx.mjs`, `starter/tools/audio/gen-track.mjs` |
| `reactvideoeditor/remotion-templates` | https://github.com/reactvideoeditor/remotion-templates | `6209b72` | MIT (`README.md`) | `templates/remotion-templates/` |

---

## License Texts

### MIT License (Applied to Upstream MIT Components & Original Glue Code)

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See individual upstream `LICENSE` files inside:
- `blueprints/basement-ready/LICENSE`
- `blueprints/saas-product-demo-video/LICENSE`
- `.agents/skills/saas-product-demo-video/LICENSE`
- `.agents/skills/remotion-motion-graphics/LICENSE`
- `templates/claude-remotion-examples/LICENSE`

### Remotion & `@remotion/*` Packages

- Remotion framework dependencies (`remotion`, `@remotion/*`) in `starter/package.json` and the official skill `.agents/skills/remotion-best-practices/` are governed by the **Remotion License** (`https://www.remotion.dev/docs/license`).
- See `.agents/skills/remotion-best-practices/LICENSE-REMOTION.md` and `https://www.remotion.dev/docs/license/faq` for commercial eligibility details.
