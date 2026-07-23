#!/usr/bin/env bash
# Зеркало эмулятора через scrcpy.
#
# Размытие обычно из-за --max-size (downscale). По умолчанию max-size=0 — нативное разрешение.
# Лаг — из-за bitrate/разрешения. По умолчанию max-fps=60, video-buffer=0.
#
# Профили (переопределяй env):
#   balanced (default) — max-size=0, 16M, 60fps
#   lite             — max-size=1080, 8M, 60fps  (легче по разрешению)
#   sharp            — max-size=0, 24M, 60fps  (максимум чёткости)
#
# Самый чёткий вариант без scrcpy: npm run emulator:gui (нативное окно эмулятора, нужен X11)

set -euo pipefail

SERIAL="${1:-${EMULATOR_SERIAL:-emulator-5554}}"
WINDOW_TITLE="${SCRCPY_WINDOW_TITLE:-Pixel_8}"

if ! command -v scrcpy >/dev/null 2>&1; then
	echo "scrcpy не установлен. Установи: sudo apt install scrcpy" >&2
	exit 1
fi

if ! adb -s "$SERIAL" get-state >/dev/null 2>&1; then
	echo "Устройство $SERIAL не найдено." >&2
	exit 1
fi

PROFILE="${SCRCPY_PROFILE:-balanced}"

case "$PROFILE" in
	lite)
		MAX_SIZE="${SCRCPY_MAX_SIZE:-1080}"
		BIT_RATE="${SCRCPY_VIDEO_BIT_RATE:-8M}"
		MAX_FPS="${SCRCPY_MAX_FPS:-60}"
		;;
	sharp)
		MAX_SIZE="${SCRCPY_MAX_SIZE:-0}"
		BIT_RATE="${SCRCPY_VIDEO_BIT_RATE:-24M}"
		MAX_FPS="${SCRCPY_MAX_FPS:-60}"
		;;
	balanced|*)
		MAX_SIZE="${SCRCPY_MAX_SIZE:-0}"
		BIT_RATE="${SCRCPY_VIDEO_BIT_RATE:-16M}"
		MAX_FPS="${SCRCPY_MAX_FPS:-60}"
		;;
esac

echo "[scrcpy] profile=$PROFILE max-size=$MAX_SIZE bitrate=$BIT_RATE max-fps=$MAX_FPS"

SCRCPY_ARGS=(
	-s "$SERIAL"
	--window-title "$WINDOW_TITLE"
	--max-size="$MAX_SIZE"
	--max-fps="$MAX_FPS"
	--video-bit-rate="$BIT_RATE"
	--video-buffer=0
	--no-audio
)

exec scrcpy "${SCRCPY_ARGS[@]}"
