#!/usr/bin/env bash
set -euo pipefail

SERIAL="${1:-emulator-5554}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! adb -s "$SERIAL" get-state >/dev/null 2>&1; then
	echo "Устройство $SERIAL не найдено. Сначала запусти: npm run emulator" >&2
	exit 1
fi

SCRCPY_WINDOW_TITLE="Pixel_8 mirror" exec "$SCRIPT_DIR/scrcpy-mirror.sh" "$SERIAL"
