import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import {
	Platform,
	ScrollView,
	StyleSheet,
	type StyleProp,
	type ViewStyle,
} from 'react-native'
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context'

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

	const { bottom, top } = useSafeAreaInsets()

	const os = Platform.OS

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: THEME_BACKGROUND_COLORS[resolvedColorScheme],
			...(!disableTopSafeArea
				? { [`${os === 'ios' ? 'marginTop' : 'paddingTop'}`]: top }
				: {}),
			[`${os === 'ios' ? 'marginBottom' : 'paddingBottom'}`]: bottom + 30,
		},
		scrollView: {
			flex: 1,
		},
	})

	return <ScrollView style={[styles.scrollView, style]}>{children}</ScrollView>
}
