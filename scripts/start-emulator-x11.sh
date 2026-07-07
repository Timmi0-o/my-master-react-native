#!/usr/bin/env bash
set -euo pipefail

AVD_NAME="${1:-Pixel_8}"
EMULATOR="${ANDROID_HOME:-$HOME/Android/Sdk}/emulator/emulator"
GPU_MODE="${EMULATOR_GPU:-host}"
CORES="${EMULATOR_CORES:-2}"
SKIN="${EMULATOR_SKIN:-1080x2400}"

if [[ ! -x "$EMULATOR" ]]; then
	echo "Emulator not found: $EMULATOR" >&2
	exit 1
fi

# XWayland on Ubuntu: mouse often breaks without forcing pure X11 for Qt/SDL.
# Unset Wayland so the emulator doesn't pick up broken scaling (-1) from the compositor.
unset WAYLAND_DISPLAY
export GDK_BACKEND=x11
export SDL_VIDEODRIVER=x11
export QT_QPA_PLATFORM=xcb
export GDK_SCALE=1
export QT_SCALE_FACTOR=1
export QT_AUTO_SCREEN_SCALE_FACTOR=0
export _JAVA_AWT_WM_NONREPARENTING=1
export LIBGL_DRI3_DISABLE=1

USER_INI="${HOME}/.android/avd/${AVD_NAME}.avd/emulator-user.ini"
if [[ -f "$USER_INI" ]]; then
	# Emulator resets scale to -1 on Wayland; force a valid value before each launch.
	sed -i 's/^window.scale = .*/window.scale = 1.000000/' "$USER_INI"
fi

# Software rendering (swiftshader) fixes mouse sometimes but is unusably slow — use only as fallback:
# EMULATOR_GPU=swiftshader_indirect ./scripts/start-emulator-x11.sh

ARGS=(
	-avd "$AVD_NAME"
	-gpu "$GPU_MODE"
	-cores "$CORES"
	-fixed-scale
	-no-mouse-reposition
	-no-snapshot-load
	-no-boot-anim
)

if [[ -n "$SKIN" ]]; then
	ARGS+=(-skin "$SKIN")
fi

exec "$EMULATOR" "${ARGS[@]}"
