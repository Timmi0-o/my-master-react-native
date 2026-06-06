import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { Input, type InputProps } from 'heroui-native'
import type { ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'
import {
	Platform,
	View,
	type StyleProp,
	type TextInput,
	type ViewStyle,
} from 'react-native'

const GLASS_INPUT_CLASS_NAME = 'border-0 bg-transparent px-3 py-3.5'
export const glassInnerInputClassName = 'border-0 bg-transparent'
const FALLBACK_INPUT_CLASS_NAME = 'border border-border bg-surface'

function mergeClassName(base: string, className?: string): string {
	return className ? `${base} ${className}` : base
}

interface IGlassInputShellProps {
	children: ReactNode
	style?: StyleProp<ViewStyle>
}

export function GlassInputShell({
	children,
	style,
}: IGlassInputShellProps): ReactElement {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()

	if (useGlass) {
		return (
			<GlassView
				isInteractive
				glassEffectStyle='regular'
				style={[{ borderRadius: 16, overflow: 'hidden', width: '100%' }, style]}
			>
				{children}
			</GlassView>
		)
	}

	return (
		<View
			className='overflow-hidden rounded-2xl border border-border bg-surface'
			style={style}
		>
			{children}
		</View>
	)
}

export const GlassInput = forwardRef<TextInput, InputProps>(function GlassInput(
	{ className, style, variant, ...props },
	ref,
) {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()

	if (useGlass) {
		return (
			<View style={style as StyleProp<ViewStyle>}>
				<GlassInputShell>
					<Input
						ref={ref}
						className={mergeClassName(GLASS_INPUT_CLASS_NAME, className)}
						variant={variant ?? 'secondary'}
						{...props}
					/>
				</GlassInputShell>
			</View>
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
