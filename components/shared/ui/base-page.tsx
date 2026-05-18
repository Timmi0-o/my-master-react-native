import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

interface IBasePageProps {
	children: ReactNode
	/**
	 * Which screen edges should respect safe-area insets. Defaults to top+bottom
	 * so pages don't collide with the status bar / native tab bar.
	 */
	edges?: readonly Edge[]
	style?: StyleProp<ViewStyle>
	disableTopSafeArea?: boolean
}

export function BasePage({
	children,
	style,
	disableTopSafeArea = false,
}: IBasePageProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()

	return (
		<SafeAreaView
			style={{
				backgroundColor: THEME_BACKGROUND_COLORS[resolvedColorScheme],
				flex: 1,
			}}
		>
			<ScrollView
				contentContainerStyle={{
					backgroundColor: THEME_BACKGROUND_COLORS[resolvedColorScheme],
					flex: 1,
				}}
				style={style}
			>
				{children}
			</ScrollView>
		</SafeAreaView>
	)
}
