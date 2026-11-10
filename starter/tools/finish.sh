#!/usr/bin/env bash
# finish.sh - Render a Remotion composition and master audio to -14 LUFS / -1 dBTP in two passes.
# Usage (from starter/):
#   bash tools/finish.sh [CompositionId=Master] [OutDir=out] [Concurrency=2] [Entry=src/index.ts]
# Adapted cleanly from Dbar2/basement-ready (MIT).
set -euo pipefail

COMP="${1:-Master}"
OUT="${2:-out}"
CONCURRENCY="${3:-2}"
ENTRY="${4:-src/index.ts}"
RAW="$OUT/${COMP}-raw.mp4"
FINAL="$OUT/${COMP}.mp4"
WEB720="$OUT/${COMP}-720p.mp4"

mkdir -p "$OUT"

# Prefer explicit REMOTION_BROWSER; fall back on macOS to Playwright's chrome-headless-shell if installed.
BROWSER="${REMOTION_BROWSER:-}"
if [[ -z "$BROWSER" && -d "$HOME/Library/Caches/ms-playwright" ]]; then
  BROWSER="$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell 2>/dev/null | tail -1 || true)"
fi

RENDER_ARGS=(remotion render "$ENTRY" "$COMP" "$RAW" --concurrency="$CONCURRENCY" --crf=16 --audio-bitrate=320k --log=error)
if [[ -n "$BROWSER" ]]; then
  RENDER_ARGS+=(--browser-executable="$BROWSER")
fi

npx "${RENDER_ARGS[@]}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found on PATH; wrote un-normalized render to $RAW"
  exit 0
fi

# Check whether raw MP4 contains an audio stream; if silent/muted, copy faststart directly.
HAS_AUDIO="$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$RAW" || true)"
if [[ -z "$HAS_AUDIO" ]]; then
  mv "$RAW" "$FINAL"
else
  # Two-pass EBU R128 loudness normalization (-14 LUFS, -1 dBTP), video stream copied verbatim.
  M=$(ffmpeg -hide_banner -nostats -i "$RAW" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  get() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -hide_banner -loglevel error -y -i "$RAW" -c:v copy \
    -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
    -c:a aac -b:a 320k -movflags +faststart "$FINAL"
  ffmpeg -hide_banner -nostats -i "$FINAL" -af ebur128=peak=true -f null - 2>&1 | awk '/Summary:/{f=1} f' | grep -E " I:|Peak:" || true
fi

ffmpeg -hide_banner -loglevel error -y -i "$FINAL" -vf scale=1280:720:flags=lanczos -c:v libx264 -crf 20 -preset slow -c:a copy -movflags +faststart "$WEB720"
echo "Wrote $FINAL and $WEB720 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$FINAL")s)"
