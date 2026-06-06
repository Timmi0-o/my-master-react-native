import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom']
const TOP_EDGE_FADE_DISTANCE = 48

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
	const topEdgeBorderColor =
		resolvedColorScheme === 'dark'
			? 'rgba(255, 255, 255, 0.08)'
			: 'rgba(0, 0, 0, 0.08)'

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
							backgroundColor,
							borderBottomColor: topEdgeBorderColor,
							borderBottomWidth: StyleSheet.hairlineWidth,
							height: insets.top,
							left: 0,
							position: 'absolute',
							right: 0,
							top: 0,
							zIndex: 10,
						},
						topEdgeAnimatedStyle,
					]}
				/>
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
