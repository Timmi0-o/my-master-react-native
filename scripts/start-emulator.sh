#!/usr/bin/env bash
set -euo pipefail

AVD_NAME="${1:-Pixel_8}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${EMULATOR_MODE:-auto}"

if [[ "$MODE" == "auto" ]]; then
	if [[ "${XDG_SESSION_TYPE:-}" == "wayland" ]]; then
		MODE="headless"
	else
		MODE="gui"
	fi
fi

case "$MODE" in
	headless)
		echo "[emulator] Wayland detected -> headless + scrcpy"
		exec "$SCRIPT_DIR/start-emulator-headless.sh" "$AVD_NAME"
		;;
	gui)
		echo "[emulator] GUI mode (X11)"
		exec "$SCRIPT_DIR/start-emulator-x11.sh" "$AVD_NAME"
		;;
	*)
		echo "Unknown EMULATOR_MODE: $MODE (use auto|headless|gui)" >&2
		exit 1
		;;
esac
