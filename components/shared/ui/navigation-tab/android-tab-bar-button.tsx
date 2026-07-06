import type { ReactElement, ReactNode } from 'react'
import {
	Pressable,
	type GestureResponderEvent,
	type PressableProps,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

type AndroidTabBarButtonProps = Omit<PressableProps, 'children' | 'style'> & {
	children: ReactNode
	href?: string | null
	style?: StyleProp<ViewStyle>
	onPress?: (event: GestureResponderEvent) => void
}

export function AndroidTabBarButton({
	children,
	style,
	onPress,
	onLongPress,
	...rest
}: AndroidTabBarButtonProps): ReactElement {
	return (
		<Pressable
			{...rest}
			android_ripple={null}
			onLongPress={onLongPress}
			onPress={onPress}
			style={({ pressed }) => [style, styles.button, pressed && styles.pressed]}
		>
			{children}
		</Pressable>
	)
}

const styles = {
	button: {
		flex: 1,
		alignItems: 'center' as const,
		justifyContent: 'center' as const,
		minHeight: 48,
	},
	pressed: {
		opacity: 0.65,
	},
}
