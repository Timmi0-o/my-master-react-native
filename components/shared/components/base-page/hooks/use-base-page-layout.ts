import {
	BASE_PAGE_EDGE_FADE_EXTENT,
	BASE_PAGE_FOOTER_CONTENT_MIN_HEIGHT,
	BASE_PAGE_FOOTER_PADDING_TOP,
} from '../constants/base-page.constants'
import { buildEdgeFadeStops } from '../helpers/build-edge-fade-stops'
import type { IBasePageLayoutInput, IBasePageLayoutState } from '../base-page.types'

export function useBasePageLayout({
	headerContent,
	footerContent,
	isHeaderFixed,
	isFooterFixed,
	edges,
	disableTopSafeArea,
	adjustForKeyboard,
	scrollEnabled,
	onRefresh,
	insets,
	backgroundColor,
}: IBasePageLayoutInput): IBasePageLayoutState {
	const hasHeader = headerContent != null
	const hasFooter = footerContent != null
	const hasScrollHeader = hasHeader && !isHeaderFixed
	const hasFixedHeader = hasHeader && isHeaderFixed
	const hasFixedFooter = hasFooter && isFooterFixed
	const hasScrollFooter = hasFooter && !isFooterFixed
	const useKeyboardAvoidingFooter = adjustForKeyboard && hasFixedFooter
	const useAbsoluteFooter = hasFixedFooter && !useKeyboardAvoidingFooter

	const paddingTop =
		!disableTopSafeArea && !hasHeader && edges.includes('top') ? insets.top : 0
	const paddingBottom = useAbsoluteFooter
		? 0
		: edges.includes('bottom')
			? insets.bottom + 10
			: 0
	const paddingLeft = edges.includes('left') ? insets.left : 0
	const paddingRight = edges.includes('right') ? insets.right : 0
	const headerPaddingTop =
		!disableTopSafeArea && hasHeader && edges.includes('top') ? insets.top : 0
	const showTopEdgeBackground =
		onRefresh == null &&
		!disableTopSafeArea &&
		edges.includes('top') &&
		insets.top > 0
	const showBottomEdgeBackground = useAbsoluteFooter

	const footerReservedHeight =
		BASE_PAGE_FOOTER_PADDING_TOP +
		BASE_PAGE_FOOTER_CONTENT_MIN_HEIGHT +
		insets.bottom
	const scrollPaddingBottom = useAbsoluteFooter
		? footerReservedHeight + BASE_PAGE_EDGE_FADE_EXTENT
		: paddingBottom

	const topEdgeFade = buildEdgeFadeStops(insets.top, insets.top)
	const bottomEdgeFade = buildEdgeFadeStops(
		insets.bottom,
		footerReservedHeight,
	)

	const hasRefresh = onRefresh != null
	const trackScroll =
		scrollEnabled &&
		(showTopEdgeBackground || useAbsoluteFooter || hasRefresh)

	return {
		hasScrollHeader,
		hasFixedHeader,
		hasScrollFooter,
		useKeyboardAvoidingFooter,
		useAbsoluteFooter,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		headerPaddingTop,
		showTopEdgeBackground,
		showBottomEdgeBackground,
		scrollPaddingBottom,
		headerSlotStyle: {
			backgroundColor,
			paddingLeft,
			paddingRight,
			paddingTop: headerPaddingTop,
		},
		hasRefresh,
		trackScroll,
		refreshIndicatorTop: Math.max(paddingTop, insets.top) + 4,
		topEdgeOverlayHeight: topEdgeFade.overlayHeight,
		bottomEdgeOverlayHeight: bottomEdgeFade.overlayHeight,
		topBackgroundFadeMidOffset: topEdgeFade.fadeMidOffset,
		topBackgroundFadeEndOffset: topEdgeFade.fadeEndOffset,
		topSafeAreaEndOffset: topEdgeFade.safeAreaEndOffset,
		bottomBackgroundFadeMidOffset: bottomEdgeFade.fadeMidOffset,
		bottomBackgroundFadeEndOffset: bottomEdgeFade.fadeEndOffset,
		bottomSafeAreaEndOffset: bottomEdgeFade.safeAreaEndOffset,
	}
}
