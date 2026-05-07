import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native'
import {
	SafeAreaView,
	useSafeAreaInsets,
	type Edge,
} from 'react-native-safe-area-context'

interface IBasePageProps {
	children: ReactNode
	/**
	 * Which screen edges should respect safe-area insets. Defaults to top+bottom
	 * so pages don't collide with the status bar / native tab bar.
	 */
	edges?: readonly Edge[]
	style?: StyleProp<ViewStyle>
}

export function BasePage({ children, style }: IBasePageProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()

	const { bottom, top } = useSafeAreaInsets()

	return (
		<SafeAreaView
			style={[
				{
					flex: 1,
					backgroundColor: THEME_BACKGROUND_COLORS[resolvedColorScheme],
				},
				style,
			]}
		>
			<ScrollView
				style={{ marginTop: top - 60, marginBottom: bottom + 20, flex: 1 }}
			>
				{children}
			</ScrollView>
		</SafeAreaView>
	)
}
