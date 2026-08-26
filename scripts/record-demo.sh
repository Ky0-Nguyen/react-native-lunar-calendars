#!/usr/bin/env bash
#
# Records the README demo: Maestro drives the Expo example app on a booted iOS
# Simulator while `simctl` captures the screen. Everything stays on this machine -
# nothing is uploaded.
#
# Prerequisites:
#   * Xcode with an iOS Simulator, ffmpeg, and Maestro (https://maestro.dev)
#   * The example app already running in Expo Go:
#         npm run build && npm --prefix example install
#         npm --prefix example run ios
#
# Usage: ./scripts/record-demo.sh [flow]      # default flow: .maestro/demo.yaml
set -euo pipefail

FLOW="${1:-.maestro/demo.yaml}"
OUT_DIR="docs/media"
RAW="${OUT_DIR}/demo-raw.mov"
MP4="${OUT_DIR}/demo.mp4"
GIF="${OUT_DIR}/demo.gif"
PALETTE="$(mktemp -t lunar-palette).png"

for tool in xcrun ffmpeg maestro; do
  command -v "$tool" >/dev/null 2>&1 || {
    echo "error: '$tool' is not installed or not on PATH" >&2
    exit 1
  }
done

DEVICE_UDID="$(xcrun simctl list devices booted -j |
  /usr/bin/python3 -c 'import json,sys;d=json.load(sys.stdin)["devices"];print(next((x["udid"] for v in d.values() for x in v), ""))')"

if [ -z "$DEVICE_UDID" ]; then
  echo "error: no booted iOS Simulator. Start the example app first:" >&2
  echo "       npm --prefix example run ios" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
rm -f "$RAW" "$MP4" "$GIF"

echo "==> Recording $DEVICE_UDID"
xcrun simctl io "$DEVICE_UDID" recordVideo --codec=h264 --force "$RAW" &
RECORDER_PID=$!
# Give the recorder a moment to attach before the first tap.
sleep 2

stop_recording() {
  if kill -0 "$RECORDER_PID" 2>/dev/null; then
    kill -INT "$RECORDER_PID" 2>/dev/null || true
    wait "$RECORDER_PID" 2>/dev/null || true
  fi
}
trap stop_recording EXIT

echo "==> Running $FLOW"
maestro --device "$DEVICE_UDID" test "$FLOW"

sleep 1
stop_recording
trap - EXIT

echo "==> Encoding"
# 720p-tall MP4 for the repo, plus a palette-optimised GIF small enough for a README.
ffmpeg -loglevel error -y -i "$RAW" -vf "scale=-2:960,fps=30" -c:v libx264 -pix_fmt yuv420p -crf 26 "$MP4"
ffmpeg -loglevel error -y -i "$RAW" -vf "fps=12,scale=360:-1:flags=lanczos,palettegen=stats_mode=diff" "$PALETTE"
ffmpeg -loglevel error -y -i "$RAW" -i "$PALETTE" \
  -lavfi "fps=12,scale=360:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4" "$GIF"
rm -f "$PALETTE" "$RAW"

echo "==> Done"
ls -lh "$MP4" "$GIF"
