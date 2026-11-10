#!/usr/bin/env python3
"""
generate-voiceover.py - Synthesizes punchy, beat-aligned voiceover tracks for AEOForge.
Supports macOS built-in Neural TTS (zero dependencies/offline) and ElevenLabs API.
"""

import os
import sys
import wave
import subprocess
import urllib.request
import json

VO_DIR = os.path.join(os.path.dirname(__file__), "../../public/sfx/vo")
os.makedirs(VO_DIR, exist_ok=True)

# Cinematic Short-Story Script aligned with our 5 scene durations
SCRIPT = [
    {
        "id": "vo-scene1",
        "scene": "The Hook",
        "rate": 215,
        "text": "Built for humans. A deadly token trap for autonomous AI agents."
    },
    {
        "id": "vo-scene2",
        "scene": "Autonomous Audit",
        "rate": 215,
        "text": "Bloated DOMs and unhandled modal walls choke autonomous scrapers."
    },
    {
        "id": "vo-scene3",
        "scene": "Visual Perception",
        "rate": 220,
        "text": "Enter AEOForge. OmniParser locks sub-pixel coordinates in real time."
    },
    {
        "id": "vo-scene4",
        "scene": "AST Self-Healing",
        "rate": 205,
        "text": "Atomic self-healing collapses forty-five thousand tokens into two-eighty."
    },
    {
        "id": "vo-scene5",
        "scene": "Closing CTA",
        "rate": 215,
        "text": "Zero API bills. Sub-millisecond speed. Unleash your agents with AEOForge."
    }
]

def synthesize_edge_tts(text: str, out_wav: str, voice="en-US-ChristopherNeural", rate="+15%"):
    """
    Synthesize high-fidelity human AI voiceover using Microsoft Azure Neural TTS (100% Free).
    Voices include:
      - 'en-US-ChristopherNeural' (Deep, cinematic trailer tone)
      - 'en-US-AndrewMultilingualNeural' (Warm, authentic tech presenter)
      - 'en-GB-RyanNeural' (Engaging British narrator)
    """
    temp_mp3 = out_wav.replace(".wav", ".mp3")
    cmd = [
        sys.executable, "-m", "edge_tts",
        "--voice", voice,
        "--rate", rate,
        "--text", text,
        "--write-media", temp_mp3
    ]
    subprocess.run(cmd, check=True)
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@44100", temp_mp3, out_wav], check=True)
    if os.path.exists(temp_mp3):
        os.remove(temp_mp3)

def synthesize_elevenlabs(text: str, out_wav: str, api_key: str, voice_id="21m00Tcm4TlvDq8ikWAM"):
    """Fetch studio voice from ElevenLabs REST API."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    temp_mp3 = out_wav.replace(".wav", ".mp3")
    with urllib.request.urlopen(req) as resp, open(temp_mp3, "wb") as f:
        f.write(resp.read())
    
    # Convert MP3 to 44.1kHz 16-bit WAV
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@44100", temp_mp3, out_wav], check=True)
    if os.path.exists(temp_mp3):
        os.remove(temp_mp3)

def main():
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    voice = os.environ.get("VOICE", "en-US-ChristopherNeural")
    mode = "ElevenLabs" if api_key else f"Edge Neural AI TTS ({voice})"
    print(f"🎙️  Synthesizing AEOForge Voiceover via {mode}...")
    
    for item in SCRIPT:
        out_wav = os.path.join(VO_DIR, f"{item['id']}.wav")
        print(f"  → Generating [{item['id']}] ({item['scene']})...")
        if api_key:
            try:
                synthesize_elevenlabs(item["text"], out_wav, api_key)
            except Exception as e:
                print(f"    ElevenLabs failed ({e}), falling back to Edge Neural TTS...")
                synthesize_edge_tts(item["text"], out_wav, voice=voice, rate="+15%")
        else:
            synthesize_edge_tts(item["text"], out_wav, voice=voice, rate="+15%")
            
        with wave.open(out_wav, "r") as w:
            dur = w.getnframes() / float(w.getframerate())
            print(f"    ✓ Saved {out_wav} ({dur:.2f}s, voice={voice})")

    print("\n✅ All 5 human AI voiceover scene tracks generated successfully in public/sfx/vo/!")

if __name__ == "__main__":
    main()
