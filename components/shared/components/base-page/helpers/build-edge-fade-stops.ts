import { BASE_PAGE_EDGE_FADE_EXTENT } from '../constants/base-page.constants'
import type { IEdgeFadeStops } from '../base-page.types'

export function buildEdgeFadeStops(
	safeAreaInset: number,
	contentHeight: number,
): IEdgeFadeStops {
	const overlayHeight = contentHeight + BASE_PAGE_EDGE_FADE_EXTENT
	const safeAreaEndOffset =
		overlayHeight > 0 ? safeAreaInset / overlayHeight : 1

	return {
		overlayHeight,
		safeAreaEndOffset,
		fadeMidOffset: safeAreaEndOffset * 0.55,
		fadeEndOffset: Math.min(safeAreaEndOffset + 0.14, 0.94),
	}
}
