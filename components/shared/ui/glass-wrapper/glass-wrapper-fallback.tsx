import {
	GLASS_WRAPPER_FALLBACK_CLASSNAME,
	type IGlassWrapperProps,
} from '@/components/shared/ui/glass-wrapper/glass-wrapper.types'
import type { ReactElement } from 'react'
import { Pressable, View, type ViewStyle } from 'react-native'

const TINTED_FALLBACK_CLASSNAME = 'overflow-hidden rounded-2xl'

export function GlassWrapperFallback({
	children,
	contentContainerStyle,
	isDisabled = false,
	fallbackClassName = GLASS_WRAPPER_FALLBACK_CLASSNAME,
	onPress,
	style,
	tintColor,
}: IGlassWrapperProps): ReactElement {
	const isTinted = tintColor != null

	const disabledStyle: ViewStyle | undefined = isDisabled
		? { opacity: 0.5 }
		: undefined

	const tintedStyle: ViewStyle | undefined = isTinted
		? { backgroundColor: tintColor }
		: undefined

	const resolvedClassName = isTinted ? TINTED_FALLBACK_CLASSNAME : fallbackClassName

	const containerStyle = [style, tintedStyle, contentContainerStyle, disabledStyle]

	if (onPress != null) {
		return (
			<Pressable
				accessibilityRole='button'
				accessibilityState={{ disabled: isDisabled }}
				className={`${resolvedClassName} active:opacity-80`}
				disabled={isDisabled}
				onPress={onPress}
				style={containerStyle}
			>
				{children}
			</Pressable>
		)
	}

	return (
		<View
			className={resolvedClassName}
			pointerEvents={isDisabled ? 'none' : 'auto'}
			style={containerStyle}
		>
			{children}
		</View>
	)
}
