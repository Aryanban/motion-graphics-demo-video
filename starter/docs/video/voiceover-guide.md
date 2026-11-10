# Natural AI Voiceover & Audio Ducking Guide

This studio includes a multi-tier neural text-to-speech (TTS) voiceover pipeline designed to replace stiff, robotic system voices with natural, human-sounding narration that features organic breathing, micro-pauses, and conversational inflection.

---

## 1. Supported Voiceover Providers

| Provider | Cost & Quota | Realism | API Key / Account Required? | Best Used For |
| :--- | :---: | :---: | :---: | :--- |
| **Microsoft Edge Neural TTS (`edge-tts`)** | **100% Free / Unlimited** | **9 / 10** | **No** (Zero signup, zero keys) | Daily video builds, CI/CD automated renders, zero-cost production |
| **ElevenLabs (Free Tier)** | **Free (10k chars/mo)** | **10 / 10** | **Yes** (Free account at [elevenlabs.io](https://elevenlabs.io)) | High-stakes release videos, emotional storytelling, cinematic voice acting |
| **Kokoro-82M / Piper (Open Source)** | **100% Free / Unlimited** | **8.8 / 10** | **No** (Local weights) | Strict air-gapped offline environments |
| **macOS Native CoreAudio (`say`)** | Built-in | **5 / 10** | No | Instant scratch timing verification |

---

## 2. Recommended Neural Voices

### Microsoft Edge Neural Voices (Free)
- **`en-US-AndrewMultilingualNeural` (Default)**: Warm, confident Silicon Valley tech presenter (the Microsoft Copilot voice).
- **`en-US-ChristopherNeural`**: Deep, resonant, cinematic documentary / movie-trailer narrator.
- **`en-GB-RyanNeural`**: Sharp, modern, conversational British tech founder tone.
- **`en-US-AriaNeural`**: Articulate, professional, engaging female narrator.
- **`en-US-GuyNeural`**: Upbeat, approachable American SaaS product tour voice.

### ElevenLabs Studio Voices
- **`Adam`** (`pNInz6obpgDQGcFmaJgB`): Authoritative, deep, cinematic tech narrator.
- **`Rachel`** (`21m00Tcm4TlvDq8ikWAM`): Calm, engaging, trustworthy product presenter.
- **`Antoni`** (`ErXwobaYiN019PkySvjV`): Dynamic, expressive storyteller.

---

## 3. How to Synthesize Voiceovers

The generator script is located at `starter/tools/audio/generate-voiceover.py`.

### A. Generate with the Default Human Neural Voice (Free)
```bash
cd starter
python3 tools/audio/generate-voiceover.py
# Or via npm shortcut:
npm run vo:gen
```
Outputs 44.1kHz 16-bit PCM WAV tracks directly into `public/sfx/vo/`:
- `vo-scene1.wav` (Scene 1: The Hook)
- `vo-scene2.wav` (Scene 2: Autonomous Audit)
- `vo-scene3.wav` (Scene 3: Visual Perception)
- `vo-scene4.wav` (Scene 4: AST Self-Healing Climax)
- `vo-scene5.wav` (Scene 5: Sovereign Runway CTA)

### B. Switch to a Different Voice (e.g. Deep Cinematic Christopher)
```bash
VOICE="en-US-ChristopherNeural" python3 tools/audio/generate-voiceover.py
```

### C. Synthesize with ElevenLabs (Studio Actor Quality)
If you have an ElevenLabs account (10,000 characters free each month):
```bash
ELEVENLABS_API_KEY="your-elevenlabs-api-key" python3 tools/audio/generate-voiceover.py
```

---

## 4. Audio Ducking Architecture (`Master.tsx`)

In professional video production, the background music bed must never compete with spoken dialogue.

In `src/Master.tsx`:
```tsx
// Dynamic Audio Ducking: ducks music volume when voiceover is active
const targetMusicVol = voiceover ? 0.35 : MUSIC_VOLUME; // 0.35 during speech vs 0.60 standard
const volume = interpolate(
  frame,
  [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES],
  [targetMusicVol, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
```

The `<VoiceoverLayer />` positions each scene's audio sequence with sub-second precision:
```tsx
export const VoiceoverLayer: React.FC<{ voiceover?: boolean }> = ({ voiceover = true }) =>
  !voiceover ? null : (
    <>
      <Sequence from={SCENES.hook.start + 6} layout="none">
        <Audio src={staticFile("sfx/vo/vo-scene1.wav")} volume={0.95} />
      </Sequence>
      <Sequence from={SCENES.auditHud.start + 8} layout="none">
        <Audio src={staticFile("sfx/vo/vo-scene2.wav")} volume={0.95} />
      </Sequence>
      {/* ... subsequent scenes ... */}
    </>
  );
```

---

## 5. Composition Controls in `Root.tsx`

You can render and preview the video with or without voiceover via Remotion compositions:

| Composition ID | Voiceover | Sound Effects (SFX) | Music Bed | Description |
| :--- | :---: | :---: | :---: | :--- |
| `Master` | ✅ Enabled | ✅ Enabled | ✅ Ducked | Full animated story with human voiceover |
| `Master-NoVoiceover` | ❌ Disabled | ✅ Enabled | ✅ Full (0.60) | Pure motion graphics & SFX cut |
| `Master-NoSfx` | ❌ Disabled | ❌ Disabled | ✅ Full (0.60) | Music bed only (for manual editing) |

Render the story video with voiceover:
```bash
npm run render
```
Render the music-only cut:
```bash
npx remotion render src/index.ts Master-NoVoiceover out/master-music-only.mp4
```

---

## 6. Customizing Your Script

To write your own narration, open `tools/audio/generate-voiceover.py` and modify the `SCRIPT` array:
```python
SCRIPT = [
    {
        "id": "vo-scene1",
        "scene": "The Hook",
        "rate": "+35%",
        "text": "Your custom scene 1 hook text here."
    },
    ...
]
```
> **Tip on Pacing:** Keep script lines between 10 and 15 words per 3.5–4.5 second scene. Set speech rate between `+25%` and `+35%` for crisp, energetic modern tech pacing.
