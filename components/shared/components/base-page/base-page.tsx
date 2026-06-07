import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import { useState, type ReactElement } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { IBasePageProps } from './base-page.types'
import { BasePageAbsoluteFooter } from './components/base-page-absolute-footer/base-page-absolute-footer'
import { BasePageEdgeFade } from './components/base-page-edge-fade/base-page-edge-fade'
import { BasePageMainColumn } from './components/base-page-main-column/base-page-main-column'
import { BasePageOverlaySlot } from './components/base-page-overlay-slot/base-page-overlay-slot'
import { BasePagePullRefreshIndicator } from './components/base-page-pull-refresh-indicator/base-page-pull-refresh-indicator'
import { BASE_PAGE_DEFAULT_EDGES } from './constants/base-page.constants'
import { useBasePageLayout } from './hooks/use-base-page-layout'
import { useBasePageScrollBehavior } from './hooks/use-base-page-scroll-behavior'

export type { IBasePageProps } from './base-page.types'

export function BasePage({
	children,
	headerContent,
	footerContent,
	isHeaderFixed = false,
	isFooterFixed = true,
	useOverlayChrome = false,
	scrollEnabled = true,
	style,
	contentContainerStyle,
	edges = BASE_PAGE_DEFAULT_EDGES,
	disableTopSafeArea = false,
	adjustForKeyboard = false,
	onRefresh,
	refreshing = false,
}: IBasePageProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()
	const insets = useSafeAreaInsets()
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]
	const [headerOverlayHeight, setHeaderOverlayHeight] = useState(0)
	const [footerOverlayHeight, setFooterOverlayHeight] = useState(0)

	const layout = useBasePageLayout({
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
	})

	const {
		handleScroll,
		pullOffset,
		topEdgeAnimatedStyle,
		bottomEdgeAnimatedStyle,
		refreshIndicatorAnimatedStyle,
	} = useBasePageScrollBehavior({
		hasRefresh: layout.hasRefresh,
		refreshing,
		onRefresh,
		trackScroll: layout.trackScroll,
	})

	const mainColumn = (
		<BasePageMainColumn
			adjustForKeyboard={adjustForKeyboard}
			backgroundColor={backgroundColor}
			contentContainerStyle={contentContainerStyle}
			edgesIncludeBottom={edges.includes('bottom')}
			footerContent={footerContent}
			hasRefresh={layout.hasRefresh}
			headerContent={headerContent}
			insetsBottom={insets.bottom}
			layout={layout}
			onRefresh={onRefresh}
			onScroll={handleScroll}
			refreshing={refreshing}
			scrollEnabled={scrollEnabled}
			style={style}
		>
			{children}
		</BasePageMainColumn>
	)

	const pageBody = useOverlayChrome ? (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, zIndex: 0 }}>{mainColumn}</View>

			{layout.showOverlayTopFade ? (
				<BasePageEdgeFade
					backgroundColor={backgroundColor}
					chromeZoneRatio={layout.overlayHeaderChromeRatio}
					edgeInset={0}
					fadeKind='overlay'
					gradientId='basePageOverlayTopFade'
					height={layout.overlayHeaderFadeHeight}
					placement='top'
				/>
			) : null}

			{layout.showOverlayBottomFade ? (
				<BasePageEdgeFade
					backgroundColor={backgroundColor}
					chromeZoneRatio={layout.overlayFooterChromeRatio}
					edgeInset={0}
					fadeKind='overlay'
					gradientId='basePageOverlayBottomFade'
					height={layout.overlayFooterFadeHeight}
					placement='bottom'
				/>
			) : null}

			{layout.hasFixedHeader && headerContent != null ? (
				<BasePageOverlaySlot
					onLayout={setHeaderOverlayHeight}
					placement='top'
					style={layout.headerOverlayStyle}
				>
					{headerContent}
				</BasePageOverlaySlot>
			) : null}

			{layout.hasFixedFooter && footerContent != null ? (
				<BasePageOverlaySlot
					onLayout={setFooterOverlayHeight}
					placement='bottom'
					style={layout.footerOverlayStyle}
				>
					{footerContent}
				</BasePageOverlaySlot>
			) : null}
		</View>
	) : (
		mainColumn
	)

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			{useOverlayChrome && adjustForKeyboard ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={0}
					style={{ flex: 1 }}
				>
					{pageBody}
				</KeyboardAvoidingView>
			) : layout.useKeyboardAvoidingFooter ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={0}
					style={{ flex: 1 }}
				>
					{pageBody}
				</KeyboardAvoidingView>
			) : (
				pageBody
			)}

			{layout.hasRefresh ? (
				<BasePagePullRefreshIndicator
					animatedStyle={refreshIndicatorAnimatedStyle}
					pullOffset={pullOffset}
					refreshIndicatorTop={layout.refreshIndicatorTop}
					refreshing={refreshing}
				/>
			) : null}

			{layout.showTopEdgeBackground ? (
				<BasePageEdgeFade
					animatedStyle={topEdgeAnimatedStyle}
					backgroundColor={backgroundColor}
					gradientId='basePageTopBackgroundFade'
					height={layout.topEdgeOverlayHeight}
					placement='top'
					scrollFadeStops={layout.topScrollFadeStops}
				/>
			) : null}

			{layout.showBottomEdgeBackground ? (
				<BasePageEdgeFade
					animatedStyle={bottomEdgeAnimatedStyle}
					backgroundColor={backgroundColor}
					gradientId='basePageBottomBackgroundFade'
					height={layout.bottomEdgeOverlayHeight}
					placement='bottom'
					scrollFadeStops={layout.bottomScrollFadeStops}
				/>
			) : null}

			{layout.useAbsoluteFooter && footerContent != null ? (
				<BasePageAbsoluteFooter
					paddingLeft={layout.paddingLeft}
					paddingRight={layout.paddingRight}
				>
					{footerContent}
				</BasePageAbsoluteFooter>
			) : null}
		</View>
	)
}
