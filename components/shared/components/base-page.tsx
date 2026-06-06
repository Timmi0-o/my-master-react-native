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
const TOP_EDGE_FADE_DISTANCE = 48
const TOP_EDGE_FADE_EXTENT = 24

interface IBasePageProps {
	children: ReactNode
	/**
	 * Fixed block above the scroll area (not overlay).
	 */
	headerContent?: ReactNode
	/**
	 * Fixed block below the scroll area (not overlay). Safe-area bottom is handled
	 * by footerContent itself when needed.
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
	const paddingBottom =
		!hasFooter && edges.includes('bottom') ? insets.bottom + 10 : 0
	const paddingLeft = edges.includes('left') ? insets.left : 5
	const paddingRight = edges.includes('right') ? insets.right : 0
	const headerPaddingTop =
		!disableTopSafeArea && hasHeader && edges.includes('top') ? insets.top : 0
	const showTopEdgeBackground =
		!disableTopSafeArea && edges.includes('top') && insets.top > 0
	const topEdgeOverlayHeight = insets.top + TOP_EDGE_FADE_EXTENT
	const safeAreaEndOffset =
		topEdgeOverlayHeight > 0 ? insets.top / topEdgeOverlayHeight : 1
	const backgroundFadeMidOffset = safeAreaEndOffset * 0.55
	const backgroundFadeEndOffset = Math.min(safeAreaEndOffset + 0.14, 0.94)

	const scrollY = useSharedValue(0)

	const handleScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y
		},
	})

	const topEdgeAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, TOP_EDGE_FADE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}))

	return (
		<View style={{ backgroundColor, flex: 1 }}>
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
									offset={String(backgroundFadeMidOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.88'
								/>
								<Stop
									offset={String(safeAreaEndOffset)}
									stopColor={backgroundColor}
									stopOpacity='0.72'
								/>
								<Stop
									offset={String(backgroundFadeEndOffset)}
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
			<Animated.ScrollView
				contentContainerStyle={{
					backgroundColor,
					flexGrow: 1,
					paddingBottom,
					paddingLeft,
					paddingRight,
					paddingTop,
				}}
				onScroll={showTopEdgeBackground ? handleScroll : undefined}
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

			{footerContent ? (
				<View style={{ paddingTop: 10 }}>{footerContent}</View>
			) : null}
		</View>
	)
}
