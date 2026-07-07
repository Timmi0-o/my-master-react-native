#!/usr/bin/env bash
set -euo pipefail

SERIAL="${1:-emulator-5554}"

if ! command -v scrcpy >/dev/null 2>&1; then
	echo "scrcpy не установлен. Установи: sudo apt install scrcpy" >&2
	exit 1
fi

if ! adb -s "$SERIAL" get-state >/dev/null 2>&1; then
	echo "Устройство $SERIAL не найдено. Сначала запусти: npm run emulator" >&2
	exit 1
fi

# Управление через scrcpy обходит баг мыши в окне эмулятора на Wayland.
exec scrcpy -s "$SERIAL" --window-title "Pixel_8 mirror" --max-size 1080
