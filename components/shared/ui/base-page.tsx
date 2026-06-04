import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom']

interface IBasePageProps {
	children: ReactNode
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
	style,
	edges = DEFAULT_EDGES,
	disableTopSafeArea = false,
}: IBasePageProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()
	const insets = useSafeAreaInsets()
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]

	const paddingTop =
		!disableTopSafeArea && edges.includes('top') ? insets.top : 0
	const paddingBottom = edges.includes('bottom') ? insets.bottom + 10 : 0
	const paddingLeft = edges.includes('left') ? insets.left : 0
	const paddingRight = edges.includes('right') ? insets.right : 0

	return (
		<View style={{ backgroundColor, flex: 1 }}>
			<ScrollView
				contentContainerStyle={{
					backgroundColor,
					flexGrow: 1,
					paddingBottom,
					paddingLeft,
					paddingRight,
					paddingTop,
				}}
				style={[{ backgroundColor, flex: 1 }, style]}
			>
				{children}
			</ScrollView>
		</View>
	)
}
