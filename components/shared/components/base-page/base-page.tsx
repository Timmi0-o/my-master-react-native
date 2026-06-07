import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { IBasePageProps } from './base-page.types'
import { BasePageAbsoluteFooter } from './components/base-page-absolute-footer/base-page-absolute-footer'
import { BasePageEdgeFade } from './components/base-page-edge-fade/base-page-edge-fade'
import { BasePageMainColumn } from './components/base-page-main-column/base-page-main-column'
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

	const layout = useBasePageLayout({
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

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			{layout.useKeyboardAvoidingFooter ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={0}
					style={{ flex: 1 }}
				>
					{mainColumn}
				</KeyboardAvoidingView>
			) : (
				mainColumn
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
					fadeEndOffset={layout.topBackgroundFadeEndOffset}
					fadeMidOffset={layout.topBackgroundFadeMidOffset}
					gradientId='basePageTopBackgroundFade'
					height={layout.topEdgeOverlayHeight}
					placement='top'
					safeAreaEndOffset={layout.topSafeAreaEndOffset}
				/>
			) : null}

			{layout.showBottomEdgeBackground ? (
				<BasePageEdgeFade
					animatedStyle={bottomEdgeAnimatedStyle}
					backgroundColor={backgroundColor}
					fadeEndOffset={layout.bottomBackgroundFadeEndOffset}
					fadeMidOffset={layout.bottomBackgroundFadeMidOffset}
					gradientId='basePageBottomBackgroundFade'
					height={layout.bottomEdgeOverlayHeight}
					placement='bottom'
					safeAreaEndOffset={layout.bottomSafeAreaEndOffset}
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
