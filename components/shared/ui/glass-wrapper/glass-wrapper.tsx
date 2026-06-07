import {
	GlassView,
	isLiquidGlassAvailable,
	type GlassViewProps,
} from 'expo-glass-effect'
import type { ReactElement, ReactNode } from 'react'
import { useCallback, useRef } from 'react'
import {
	Platform,
	Pressable,
	StyleSheet,
	View,
	type GestureResponderEvent,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

const TAP_MOVE_THRESHOLD = 12

interface IGlassWrapperProps extends Omit<GlassViewProps, 'children'> {
	children: ReactNode
	contentContainerStyle?: StyleProp<ViewStyle>
	isDisabled?: boolean
	fallbackClassName?: string
	onPress?: () => void
}

export function GlassWrapper({
	children,
	contentContainerStyle,
	isDisabled = false,
	fallbackClassName = 'overflow-hidden rounded-2xl border border-border bg-surface',
	glassEffectStyle = 'regular',
	isInteractive = true,
	onPress,
	style,
	tintColor,
	...glassViewProps
}: IGlassWrapperProps): ReactElement {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()
	const flatStyle = StyleSheet.flatten(style)
	const backgroundColorFromStyle = flatStyle?.backgroundColor
	const glassStyle =
		useGlass && backgroundColorFromStyle != null
			? { ...flatStyle, backgroundColor: undefined }
			: style
	const resolvedTintColor =
		tintColor ??
		(typeof backgroundColorFromStyle === 'string'
			? backgroundColorFromStyle
			: undefined)

	const disabledStyle: ViewStyle | undefined = isDisabled
		? { opacity: 0.5 }
		: undefined
	const isGlassInteractive = isInteractive && !isDisabled

	const touchStartRef = useRef<{ x: number; y: number } | null>(null)

	const handleGlassTouchStart = useCallback(
		(event: GestureResponderEvent): void => {
			if (isDisabled || onPress == null) {
				return
			}

			touchStartRef.current = {
				x: event.nativeEvent.pageX,
				y: event.nativeEvent.pageY,
			}
		},
		[isDisabled, onPress],
	)

	const handleGlassTouchEnd = useCallback(
		(event: GestureResponderEvent): void => {
			if (isDisabled || onPress == null || touchStartRef.current == null) {
				touchStartRef.current = null
				return
			}

			const dx = Math.abs(event.nativeEvent.pageX - touchStartRef.current.x)
			const dy = Math.abs(event.nativeEvent.pageY - touchStartRef.current.y)
			touchStartRef.current = null

			if (dx <= TAP_MOVE_THRESHOLD && dy <= TAP_MOVE_THRESHOLD) {
				onPress()
			}
		},
		[isDisabled, onPress],
	)

	if (!useGlass) {
		if (onPress != null) {
			return (
				<Pressable
					accessibilityRole='button'
					accessibilityState={{ disabled: isDisabled }}
					className={`${fallbackClassName} active:opacity-80`}
					disabled={isDisabled}
					onPress={onPress}
					style={[style, contentContainerStyle, disabledStyle]}
				>
					{children}
				</Pressable>
			)
		}

		return (
			<View
				className={fallbackClassName}
				pointerEvents={isDisabled ? 'none' : 'auto'}
				style={[style, contentContainerStyle, disabledStyle]}
			>
				{children}
			</View>
		)
	}

	const content = (
		<View
			pointerEvents={onPress != null ? 'none' : undefined}
			style={contentContainerStyle}
		>
			{children}
		</View>
	)

	const glassView = (
		<GlassView
			{...glassViewProps}
			accessibilityRole={onPress != null ? 'button' : undefined}
			accessibilityState={
				onPress != null ? { disabled: isDisabled } : undefined
			}
			glassEffectStyle={glassEffectStyle}
			isInteractive={isGlassInteractive}
			onTouchEnd={onPress != null ? handleGlassTouchEnd : undefined}
			onTouchStart={onPress != null ? handleGlassTouchStart : undefined}
			style={glassStyle}
			tintColor={resolvedTintColor}
		>
			{content}
		</GlassView>
	)

	if (!isDisabled) {
		return glassView
	}

	return (
		<View pointerEvents='none' style={disabledStyle}>
			{glassView}
		</View>
	)
}
