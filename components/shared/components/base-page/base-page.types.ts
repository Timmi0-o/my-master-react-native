import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { Edge, EdgeInsets } from 'react-native-safe-area-context'

export interface IBasePageProps {
	children: ReactNode
	/** Header slot. By default scrolls with content; set `isHeaderFixed` to pin it. */
	headerContent?: ReactNode
	/** Footer slot. By default fixed overlay; set `isFooterFixed={false}` to scroll with content. */
	footerContent?: ReactNode
	/** Pin `headerContent` above the scroll area. Default: scrolls with content. */
	isHeaderFixed?: boolean
	/** Pin `footerContent` as bottom overlay. Default: true when `footerContent` is set. */
	isFooterFixed?: boolean
	/**
	 * Which screen edges get initial content padding from safe-area insets.
	 * Scroll can move content past these paddings (under status bar / tab bar).
	 */
	edges?: readonly Edge[]
	style?: StyleProp<ViewStyle>
	disableTopSafeArea?: boolean
	/** When false, children render in a flex container instead of ScrollView (e.g. FlatList). */
	scrollEnabled?: boolean
	adjustForKeyboard?: boolean
	onRefresh?: () => void
	refreshing?: boolean
	contentContainerStyle?: StyleProp<ViewStyle>
}

export interface IBasePageLayoutInput {
	headerContent?: ReactNode
	footerContent?: ReactNode
	isHeaderFixed: boolean
	isFooterFixed: boolean
	edges: readonly Edge[]
	disableTopSafeArea: boolean
	adjustForKeyboard: boolean
	scrollEnabled: boolean
	onRefresh?: () => void
	insets: EdgeInsets
	backgroundColor: string
}

export interface IBasePageLayoutState {
	hasScrollHeader: boolean
	hasFixedHeader: boolean
	hasScrollFooter: boolean
	useKeyboardAvoidingFooter: boolean
	useAbsoluteFooter: boolean
	paddingTop: number
	paddingBottom: number
	paddingLeft: number
	paddingRight: number
	headerPaddingTop: number
	showTopEdgeBackground: boolean
	showBottomEdgeBackground: boolean
	scrollPaddingBottom: number
	headerSlotStyle: ViewStyle
	hasRefresh: boolean
	trackScroll: boolean
	refreshIndicatorTop: number
	topEdgeOverlayHeight: number
	bottomEdgeOverlayHeight: number
	topBackgroundFadeMidOffset: number
	topBackgroundFadeEndOffset: number
	topSafeAreaEndOffset: number
	bottomBackgroundFadeMidOffset: number
	bottomBackgroundFadeEndOffset: number
	bottomSafeAreaEndOffset: number
}

export interface IEdgeFadeStops {
	overlayHeight: number
	safeAreaEndOffset: number
	fadeMidOffset: number
	fadeEndOffset: number
}
