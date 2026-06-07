import {
	GlassView,
	isLiquidGlassAvailable,
	type GlassViewProps,
} from 'expo-glass-effect'
import type { ReactElement, ReactNode } from 'react'
import {
	Platform,
	Pressable,
	View,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

interface IGlassSurfaceProps extends Omit<GlassViewProps, 'children'> {
	children: ReactNode
	contentContainerStyle?: StyleProp<ViewStyle>
	disabled?: boolean
	fallbackClassName?: string
	onPress?: () => void
}

export function GlassSurface({
	children,
	contentContainerStyle,
	disabled = false,
	fallbackClassName = 'overflow-hidden rounded-2xl border border-border bg-surface',
	glassEffectStyle = 'regular',
	isInteractive = true,
	onPress,
	style,
	...glassViewProps
}: IGlassSurfaceProps): ReactElement {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()

	if (!useGlass) {
		if (onPress != null) {
			return (
				<Pressable
					accessibilityRole='button'
					className={`${fallbackClassName} active:opacity-80`}
					disabled={disabled}
					onPress={onPress}
					style={[style, contentContainerStyle]}
				>
					{children}
				</Pressable>
			)
		}

		return (
			<View
				className={fallbackClassName}
				style={[style, contentContainerStyle]}
			>
				{children}
			</View>
		)
	}

	const content =
		onPress != null ? (
			<Pressable
				accessibilityRole='button'
				disabled={disabled}
				onPress={onPress}
				style={contentContainerStyle}
			>
				{children}
			</Pressable>
		) : (
			<View style={contentContainerStyle}>{children}</View>
		)

	return (
		<GlassView
			{...glassViewProps}
			glassEffectStyle={glassEffectStyle}
			isInteractive={isInteractive}
			style={style}
		>
			{content}
		</GlassView>
	)
}
