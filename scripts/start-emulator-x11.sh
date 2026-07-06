#!/usr/bin/env bash
set -euo pipefail

AVD_NAME="${1:-Pixel_10}"
EMULATOR="${ANDROID_HOME:-$HOME/Android/Sdk}/emulator/emulator"
GPU_MODE="${EMULATOR_GPU:-host}"
CORES="${EMULATOR_CORES:-2}"

if [[ ! -x "$EMULATOR" ]]; then
	echo "Emulator not found: $EMULATOR" >&2
	exit 1
fi

# XWayland on Ubuntu: mouse often breaks without forcing X11 for Qt/SDL.
# LIBGL_DRI3_DISABLE helps some AMD + emulator input/render glitches on Linux.
export GDK_BACKEND=x11
export SDL_VIDEODRIVER=x11
export QT_QPA_PLATFORM=xcb
export GDK_SCALE=1
export QT_SCALE_FACTOR=1
export LIBGL_DRI3_DISABLE=1

# Software rendering (swiftshader) fixes mouse sometimes but is unusably slow — use only as fallback:
# EMULATOR_GPU=swiftshader_indirect ./scripts/start-emulator-x11.sh

exec "$EMULATOR" \
	-avd "$AVD_NAME" \
	-gpu "$GPU_MODE" \
	-cores "$CORES" \
	-skin 1080x2424 \
	-no-boot-anim
