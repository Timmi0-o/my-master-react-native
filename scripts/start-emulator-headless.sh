#!/usr/bin/env bash
set -euo pipefail

AVD_NAME="${1:-Pixel_8}"
EMULATOR="${ANDROID_HOME:-$HOME/Android/Sdk}/emulator/emulator"
ADB="${ANDROID_HOME:-$HOME/Android/Sdk}/platform-tools/adb"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERIAL="${EMULATOR_SERIAL:-emulator-5554}"
GPU_MODE="${EMULATOR_GPU:-host}"

if [[ ! -x "$EMULATOR" ]]; then
	echo "Emulator not found: $EMULATOR" >&2
	exit 1
fi

if ! command -v scrcpy >/dev/null 2>&1; then
	echo "scrcpy не установлен. Установи: sudo apt install scrcpy" >&2
	exit 1
fi

wait_for_boot() {
	"$ADB" wait-for-device
	echo "[emulator] Waiting for Android boot..."
	until [[ "$("$ADB" -s "$SERIAL" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
		sleep 1
	done
	echo "[emulator] Boot completed"
}

start_headless_emulator() {
	echo "[emulator] Starting headless AVD: $AVD_NAME (GPU: $GPU_MODE)"
	"$EMULATOR" \
		-avd "$AVD_NAME" \
		-no-window \
		-gpu "$GPU_MODE" \
		-cores "${EMULATOR_CORES:-2}" \
		-no-snapshot-load \
		-no-boot-anim \
		>/tmp/emulator-headless.log 2>&1 &
	EMULATOR_PID=$!
	echo "[emulator] PID $EMULATOR_PID (logs: /tmp/emulator-headless.log)"
	wait_for_boot
}

if "$ADB" -s "$SERIAL" get-state >/dev/null 2>&1; then
	echo "[emulator] Device $SERIAL already online"
else
	start_headless_emulator
fi

node "$PROJECT_DIR/scripts/adb-reverse-minio.mjs"

echo "[emulator] Launching scrcpy mirror..."
SCRCPY_WINDOW_TITLE="Pixel_8" exec "$SCRIPT_DIR/scrcpy-mirror.sh" "$SERIAL"
