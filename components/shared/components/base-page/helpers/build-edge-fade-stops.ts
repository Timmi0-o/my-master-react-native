import {
	BASE_PAGE_EDGE_FADE_EXTENT,
	BASE_PAGE_SCROLL_FADE_FALLOFF_POWER,
	BASE_PAGE_SCROLL_FADE_MAX_OPACITY,
} from '../constants/base-page.constants'
import type { IEdgeFadeStops } from '../base-page.types'
import {
	buildOpacityStopsWithChromePlateau,
	type IOverlayOpacityStop,
} from './build-overlay-opacity-stops'

export function buildEdgeFadeStops(
	safeAreaInset: number,
	contentHeight: number,
): IEdgeFadeStops {
	const overlayHeight = contentHeight + BASE_PAGE_EDGE_FADE_EXTENT
	const safeAreaEndOffset =
		overlayHeight > 0 ? safeAreaInset / overlayHeight : 1
	const scrollFadeStops = buildOpacityStopsWithChromePlateau(
		BASE_PAGE_SCROLL_FADE_MAX_OPACITY,
		BASE_PAGE_SCROLL_FADE_FALLOFF_POWER,
		safeAreaEndOffset,
		'start',
	)

	return {
		overlayHeight,
		safeAreaEndOffset,
		scrollFadeStops,
	}
}
