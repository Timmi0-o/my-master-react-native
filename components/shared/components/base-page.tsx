import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom']
const EDGE_FADE_DISTANCE = 48
const EDGE_FADE_EXTENT = 24
const FOOTER_CONTENT_MIN_HEIGHT = 52
const FOOTER_PADDING_TOP = 10

interface IBasePageProps {
	children: ReactNode
	/**
	 * Scrolls with page content (inside ScrollView).
	 */
	headerContent?: ReactNode
	/**
	 * Fixed overlay at the bottom. Content scrolls underneath; safe-area bottom
	 * should be handled inside footerContent when needed.
	 */
	footerContent?: ReactNode
	/**
	 * Which screen edges get initial content padding from safe-area insets.
	 * Scroll can move content past these paddings (under status bar / tab bar).
	 */
	edges?: readonly Edge[]
	style?: StyleProp<ViewStyle>
	disableTopSafeArea?: boolean
}

export function BasePage({
	children,
	headerContent,
	footerContent,
	style,
	edges = DEFAULT_EDGES,
	disableTopSafeArea = false,
}: IBasePageProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()
	const insets = useSafeAreaInsets()
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]
	const hasHeader = headerContent != null
	const hasFooter = footerContent != null

	const paddingTop =
		!disableTopSafeArea && !hasHeader && edges.includes('top') ? insets.top : 0
	const paddingBottom = hasFooter
		? 0
		: edges.includes('bottom')
			? insets.bottom + 10
			: 0
	const paddingLeft = edges.includes('left') ? insets.left : 5
	const paddingRight = edges.includes('right') ? insets.right : 0
	const headerPaddingTop =
		!disableTopSafeArea && hasHeader && edges.includes('top') ? insets.top : 0
	const showTopEdgeBackground =
		!disableTopSafeArea && edges.includes('top') && insets.top > 0
	const showBottomEdgeBackground = hasFooter

	const footerReservedHeight =
		FOOTER_PADDING_TOP + FOOTER_CONTENT_MIN_HEIGHT + insets.bottom
	const scrollPaddingBottom = hasFooter
		? footerReservedHeight + EDGE_FADE_EXTENT
		: paddingBottom

	const topEdgeOverlayHeight = insets.top + EDGE_FADE_EXTENT
	const topSafeAreaEndOffset =
		topEdgeOverlayHeight > 0 ? insets.top / topEdgeOverlayHeight : 1
	const topBackgroundFadeMidOffset = topSafeAreaEndOffset * 0.55
	const topBackgroundFadeEndOffset = Math.min(topSafeAreaEndOffset + 0.14, 0.94)

	const bottomEdgeOverlayHeight = footerReservedHeight + EDGE_FADE_EXTENT
	const bottomSafeAreaEndOffset =
		bottomEdgeOverlayHeight > 0 ? insets.bottom / bottomEdgeOverlayHeight : 1
	const bottomBackgroundFadeMidOffset = bottomSafeAreaEndOffset * 0.55
	const bottomBackgroundFadeEndOffset = Math.min(
		bottomSafeAreaEndOffset + 0.14,
		0.94,
	)

	const scrollY = useSharedValue(0)
	const trackScroll = showTopEdgeBackground || hasFooter

	const handleScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

	const topEdgeAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, EDGE_FADE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}))

	const bottomEdgeAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, EDGE_FADE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}))

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			<Animated.ScrollView
				contentContainerStyle={{
					backgroundColor,
					flexGrow: 1,
					paddingBottom: scrollPaddingBottom,
					paddingLeft,
					paddingRight,
					paddingTop,
				}}
				onScroll={trackScroll ? handleScroll : undefined}
				scrollEventThrottle={16}
				style={[{ backgroundColor, flex: 1 }, style]}
			>
				{headerContent ? (
					<View
						style={{
							paddingLeft,
							paddingRight,
							paddingTop: headerPaddingTop,
						}}
					>
						{headerContent}
					</View>
				) : null}
				{children}
			</Animated.ScrollView>

			{showTopEdgeBackground ? (
				<Animated.View
					pointerEvents='none'
					style={[
						{
							height: topEdgeOverlayHeight,
							left: 0,
							position: 'absolute',
							right: 0,
							top: 0,
							zIndex: 10,
						},
						topEdgeAnimatedStyle,
					]}
				>
					<Svg
						height={topEdgeOverlayHeight}
						preserveAspectRatio='none'
						width='100%'
					>
						<Defs>
							<LinearGradient
								id='basePageTopBackgroundFade'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<Stop
									offset='0'
									stopColor={backgroundColor}
									stopOpacity='0.97'
								/>
								<Stop
									offset={String(topBackgroundFadeMidOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.88'
								/>
								<Stop
									offset={String(topSafeAreaEndOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.72'
								/>
								<Stop
									offset={String(topBackgroundFadeEndOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.24'
								/>
								<Stop offset='1' stopColor={backgroundColor} stopOpacity='0' />
							</LinearGradient>
						</Defs>
						<Rect
							fill='url(#basePageTopBackgroundFade)'
							height='100%'
							width='100%'
						/>
					</Svg>
				</Animated.View>
			) : null}

			{showBottomEdgeBackground ? (
				<Animated.View
					pointerEvents='none'
					style={[
						{
							bottom: 0,
							height: bottomEdgeOverlayHeight,
							left: 0,
							position: 'absolute',
							right: 0,
							zIndex: 10,
						},
						bottomEdgeAnimatedStyle,
					]}
				>
					<Svg
						height={bottomEdgeOverlayHeight}
						preserveAspectRatio='none'
						width='100%'
					>
						<Defs>
							<LinearGradient
								id='basePageBottomBackgroundFade'
								x1='0'
								x2='0'
								y1='1'
								y2='0'
							>
								<Stop
									offset='0'
									stopColor={backgroundColor}
									stopOpacity='0.97'
								/>
								<Stop
									offset={String(bottomBackgroundFadeMidOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.88'
								/>
								<Stop
									offset={String(bottomSafeAreaEndOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.72'
								/>
								<Stop
									offset={String(bottomBackgroundFadeEndOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.24'
								/>
								<Stop offset='1' stopColor={backgroundColor} stopOpacity='0' />
							</LinearGradient>
						</Defs>
						<Rect
							fill='url(#basePageBottomBackgroundFade)'
							height='100%'
							width='100%'
						/>
					</Svg>
				</Animated.View>
			) : null}

			{footerContent ? (
				<View
					style={{
						bottom: 0,
						left: 0,
						paddingLeft,
						paddingRight,
						paddingTop: FOOTER_PADDING_TOP,
						position: 'absolute',
						right: 0,
						zIndex: 11,
					}}
				>
					{footerContent}
				</View>
			) : null}
		</View>
	)
}
