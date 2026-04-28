import { useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import type { ReactElement, ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import {
	type Edge,
	SafeAreaView,
} from 'react-native-safe-area-context'

interface IPageScreenProps {
	children: ReactNode
	/**
	 * Which screen edges should respect safe-area insets. Defaults to top+bottom
	 * so pages don't collide with the status bar / native tab bar.
	 */
	edges?: readonly Edge[]
	style?: StyleProp<ViewStyle>
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom']

/**
 * Page-level container that:
 *  - applies safe-area insets,
 *  - paints the background through `style` (NOT className), because Uniwind
 *    does not bind `className` to the third-party native SafeAreaView, which
 *    leaves safe-area zones transparent and shows the white system layer.
 */
export function PageScreen({
	children,
	edges = DEFAULT_EDGES,
	style,
}: IPageScreenProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()

	return (
		<SafeAreaView
			edges={edges}
			style={[
				{
					flex: 1,
					backgroundColor: THEME_BACKGROUND_COLORS[resolvedColorScheme],
				},
				style,
			]}
		>
			{children}
		</SafeAreaView>
	)
}
