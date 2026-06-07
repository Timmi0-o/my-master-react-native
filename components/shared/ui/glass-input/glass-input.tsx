import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Input, type InputProps } from 'heroui-native'
import type { ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'
import {
	Platform,
	type StyleProp,
	type TextInput,
	type TextStyle,
	type ViewStyle,
} from 'react-native'

const GLASS_INPUT_CLASS_NAME = 'border-0 bg-transparent px-3 py-0'
export const glassInnerInputClassName = 'border-0 bg-transparent py-0'
const FALLBACK_INPUT_CLASS_NAME = 'border border-border bg-surface'

function mergeClassName(base: string, className?: string): string {
	return className ? `${base} ${className}` : base
}

interface IGlassInputShellProps {
	children: ReactNode
	contentContainerStyle?: StyleProp<ViewStyle>
	style?: StyleProp<ViewStyle>
}

export function GlassInputShell({
	children,
	contentContainerStyle,
	style,
}: IGlassInputShellProps): ReactElement {
	return (
		<GlassWrapper
			contentContainerStyle={[
				{ justifyContent: 'center', width: '100%' },
				style,
				contentContainerStyle,
			]}
			fallbackClassName='overflow-hidden rounded-2xl border border-border bg-surface'
			style={[{ borderRadius: 16, width: '100%' }, style]}
		>
			{children}
		</GlassWrapper>
	)
}

export const GlassInput = forwardRef<TextInput, InputProps>(function GlassInput(
	{ className, multiline, style, variant, ...props },
	ref,
) {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()
	const shellStyle = style as StyleProp<ViewStyle>

	if (useGlass) {
		return (
			<GlassInputShell
				contentContainerStyle={
					multiline ? { justifyContent: 'flex-start' } : undefined
				}
				style={shellStyle}
			>
				<Input
					ref={ref}
					className={mergeClassName(GLASS_INPUT_CLASS_NAME, className)}
					multiline={multiline}
					style={[
						shellStyle as StyleProp<TextStyle>,
						Platform.OS === 'android'
							? { textAlignVertical: multiline ? 'top' : 'center' }
							: undefined,
					]}
					variant={variant ?? 'secondary'}
					{...props}
				/>
			</GlassInputShell>
		)
	}

	return (
		<Input
			ref={ref}
			className={mergeClassName(FALLBACK_INPUT_CLASS_NAME, className)}
			style={style}
			variant={variant}
			{...props}
		/>
	)
})
