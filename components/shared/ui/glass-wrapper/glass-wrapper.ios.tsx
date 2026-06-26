import type { IGlassWrapperProps } from '@/components/shared/ui/glass-wrapper/glass-wrapper.types'
import { GlassWrapperFallback } from '@/components/shared/ui/glass-wrapper/glass-wrapper-fallback'
import {
	GlassView,
	isLiquidGlassAvailable,
} from 'expo-glass-effect'
import type { ReactElement } from 'react'
import { useCallback, useRef } from 'react'
import {
	StyleSheet,
	View,
	type GestureResponderEvent,
	type ViewStyle,
} from 'react-native'

const TAP_MOVE_THRESHOLD = 12

export type { IGlassWrapperProps } from '@/components/shared/ui/glass-wrapper/glass-wrapper.types'

export function GlassWrapper({
	children,
	contentContainerStyle,
	isDisabled = false,
	fallbackClassName,
	glassEffectStyle = 'regular',
	isInteractive = true,
	onPress,
	style,
	tintColor,
	...glassViewProps
}: IGlassWrapperProps): ReactElement {
	if (!isLiquidGlassAvailable()) {
		return (
			<GlassWrapperFallback
				contentContainerStyle={contentContainerStyle}
				fallbackClassName={fallbackClassName}
				isDisabled={isDisabled}
				onPress={onPress}
				style={style}
				tintColor={tintColor}
			>
				{children}
			</GlassWrapperFallback>
		)
	}

	const flatStyle = StyleSheet.flatten(style)
	const backgroundColorFromStyle = flatStyle?.backgroundColor
	const glassStyle =
		backgroundColorFromStyle != null
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
