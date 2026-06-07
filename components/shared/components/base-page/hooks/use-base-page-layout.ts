import type {
	IBasePageLayoutInput,
	IBasePageLayoutState,
} from '../base-page.types'
import {
	BASE_PAGE_EDGE_FADE_EXTENT,
	BASE_PAGE_FOOTER_CONTENT_MIN_HEIGHT,
	BASE_PAGE_FOOTER_PADDING_TOP,
	BASE_PAGE_HEADER_CONTENT_MIN_HEIGHT,
	BASE_PAGE_OVERLAY_FADE_HEIGHT,
} from '../constants/base-page.constants'
import { buildEdgeFadeStops } from '../helpers/build-edge-fade-stops'

export function useBasePageLayout({
	headerContent,
	footerContent,
	isHeaderFixed,
	isFooterFixed,
	useOverlayChrome,
	edges,
	disableTopSafeArea,
	adjustForKeyboard,
	scrollEnabled,
	onRefresh,
	insets,
	backgroundColor,
	headerOverlayHeight,
	footerOverlayHeight,
}: IBasePageLayoutInput): IBasePageLayoutState {
	const hasHeader = headerContent != null
	const hasFooter = footerContent != null
	const hasScrollHeader = hasHeader && !isHeaderFixed
	const hasFixedHeader = hasHeader && isHeaderFixed
	const hasFixedFooter = hasFooter && isFooterFixed
	const hasScrollFooter = hasFooter && !isFooterFixed
	const useKeyboardAvoidingFooter =
		adjustForKeyboard && hasFixedFooter && !useOverlayChrome
	const useAbsoluteFooter =
		hasFixedFooter && !useKeyboardAvoidingFooter && !useOverlayChrome

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

	const estimatedHeaderHeight =
		headerPaddingTop + BASE_PAGE_HEADER_CONTENT_MIN_HEIGHT
	const footerReservedHeight =
		BASE_PAGE_FOOTER_PADDING_TOP +
		BASE_PAGE_FOOTER_CONTENT_MIN_HEIGHT +
		insets.bottom
	const effectiveHeaderHeight =
		headerOverlayHeight > 0 ? headerOverlayHeight : estimatedHeaderHeight
	const effectiveFooterHeight =
		footerOverlayHeight > 0 ? footerOverlayHeight : footerReservedHeight

	const contentInsetTop = useOverlayChrome ? effectiveHeaderHeight : paddingTop
	const contentInsetBottom = useOverlayChrome
		? effectiveFooterHeight
		: paddingBottom

	const scrollPaddingBottom = useOverlayChrome
		? effectiveFooterHeight + BASE_PAGE_OVERLAY_FADE_HEIGHT
		: useAbsoluteFooter
			? footerReservedHeight + BASE_PAGE_EDGE_FADE_EXTENT
			: paddingBottom

	const showTopEdgeBackground =
		!useOverlayChrome &&
		onRefresh == null &&
		!disableTopSafeArea &&
		edges.includes('top') &&
		insets.top > 0
	const showBottomEdgeBackground = useAbsoluteFooter
	const showOverlayTopFade = useOverlayChrome && hasFixedHeader
	const showOverlayBottomFade = useOverlayChrome && hasFixedFooter

	const topEdgeFade = buildEdgeFadeStops(insets.top, insets.top)
	const bottomEdgeFade = buildEdgeFadeStops(insets.bottom, footerReservedHeight)
	const hasRefresh = onRefresh != null
	const trackScroll =
		scrollEnabled &&
		(showTopEdgeBackground || showBottomEdgeBackground || hasRefresh)

	return {
		hasScrollHeader,
		hasFixedHeader,
		hasScrollFooter,
		hasFixedFooter,
		useOverlayChrome,
		useKeyboardAvoidingFooter,
		useAbsoluteFooter,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		headerPaddingTop,
		contentInsetTop,
		contentInsetBottom,
		showTopEdgeBackground,
		showBottomEdgeBackground,
		showOverlayTopFade,
		showOverlayBottomFade,
		scrollPaddingBottom,
		headerSlotStyle: {
			backgroundColor,
			paddingLeft,
			paddingRight,
			paddingTop: headerPaddingTop,
		},
		headerOverlayStyle: {
			paddingLeft,
			paddingRight,
			paddingTop: headerPaddingTop,
		},
		footerOverlayStyle: {
			paddingLeft,
			paddingRight,
		},
		hasRefresh,
		trackScroll,
		refreshIndicatorTop: Math.max(paddingTop, insets.top) + 4,
		topEdgeOverlayHeight: topEdgeFade.overlayHeight,
		bottomEdgeOverlayHeight: bottomEdgeFade.overlayHeight,
		overlayHeaderFadeHeight:
			effectiveHeaderHeight + BASE_PAGE_OVERLAY_FADE_HEIGHT,
		overlayFooterFadeHeight:
			effectiveFooterHeight + BASE_PAGE_OVERLAY_FADE_HEIGHT,
		overlayHeaderChromeRatio:
			effectiveHeaderHeight /
			(effectiveHeaderHeight + BASE_PAGE_OVERLAY_FADE_HEIGHT),
		overlayFooterChromeRatio:
			effectiveFooterHeight /
			(effectiveFooterHeight + BASE_PAGE_OVERLAY_FADE_HEIGHT),
		topScrollFadeStops: topEdgeFade.scrollFadeStops,
		bottomScrollFadeStops: bottomEdgeFade.scrollFadeStops,
	}
}
