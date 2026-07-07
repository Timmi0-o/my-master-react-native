export const FLOATING_TAB_BAR_HEIGHT = 64
export const FLOATING_TAB_BAR_HORIZONTAL_INSET = 16
export const FLOATING_TAB_BAR_BOTTOM_OFFSET = 10
export const FLOATING_TAB_BAR_ICON_SIZE = 30
export const FLOATING_TAB_BAR_BORDER_RADIUS = FLOATING_TAB_BAR_HEIGHT / 2
export const FLOATING_TAB_BAR_BLUR_INTENSITY = 100
export const FLOATING_TAB_BAR_BLUR_REDUCTION_FACTOR = 2
export const FLOATING_TAB_BAR_FALLBACK_OPACITY = 0.72

export function getFloatingTabBarContentPaddingBottom(
	insetsBottom: number,
): number {
	return (
		FLOATING_TAB_BAR_HEIGHT + FLOATING_TAB_BAR_BOTTOM_OFFSET + insetsBottom + 15
	)
}
