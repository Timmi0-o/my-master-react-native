import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import {
	Input,
	InputGroup,
	SearchField,
	type InputGroupInputProps,
	type InputProps,
} from 'heroui-native'
import type { ReactElement, ReactNode } from 'react'
import { forwardRef } from 'react'
import {
	Platform,
	StyleSheet,
	type StyleProp,
	type TextInput,
	type TextStyle,
	type ViewStyle,
} from 'react-native'

const GLASS_INNER_INPUT_CLASS_NAME =
	'rounded-none border-0 bg-transparent px-3 py-0 shadow-none focus:border-0'
const GLASS_INPUT_MIN_HEIGHT = 48
const glassInnerInputStyle = {
	paddingVertical: 0,
	width: '100%',
} as const satisfies TextStyle
const FALLBACK_INPUT_CLASS_NAME = 'border border-border bg-surface'

function mergeClassName(base: string, className?: string): string {
	return className ? `${base} ${className}` : base
}

function getGlassInputTextAlignVertical(
	multiline?: boolean,
): TextStyle['textAlignVertical'] | undefined {
	if (Platform.OS !== 'android') return undefined

	return multiline ? 'top' : 'center'
}

function splitGlassInputStyle(style: StyleProp<ViewStyle>): {
	inputStyle: StyleProp<TextStyle>
	shellStyle: StyleProp<ViewStyle>
} {
	const flatStyle = StyleSheet.flatten(style) ?? {}

	return {
		shellStyle: {
			alignSelf: flatStyle.alignSelf,
			flex: flatStyle.flex,
			maxHeight: flatStyle.maxHeight,
			minHeight: flatStyle.minHeight ?? GLASS_INPUT_MIN_HEIGHT,
			width: flatStyle.width,
		},
		inputStyle: glassInnerInputStyle,
	}
}

const GlassShellInput = forwardRef<TextInput, InputProps>(function GlassShellInput(
	{ className, multiline, style, variant, ...props },
	ref,
) {
	return (
		<Input
			ref={ref}
			className={mergeClassName(GLASS_INNER_INPUT_CLASS_NAME, className)}
			multiline={multiline}
			style={[
				glassInnerInputStyle,
				{ textAlignVertical: getGlassInputTextAlignVertical(multiline) },
				style,
			]}
			variant={variant ?? 'secondary'}
			{...props}
		/>
	)
})

export const GlassInputGroupInput = forwardRef<
	TextInput,
	InputGroupInputProps
>(function GlassInputGroupInput(
	{ className, multiline, style, variant, ...props },
	ref,
) {
	return (
		<InputGroup.Input
			ref={ref}
			className={mergeClassName(GLASS_INNER_INPUT_CLASS_NAME, className)}
			multiline={multiline}
			style={[
				glassInnerInputStyle,
				{ textAlignVertical: getGlassInputTextAlignVertical(multiline) },
				style,
			]}
			variant={variant ?? 'secondary'}
			{...props}
		/>
	)
})

export function GlassSearchFieldInput(
	props: Omit<InputProps, 'onChangeText' | 'value'>,
): ReactElement {
	const { className, multiline, style, variant, ...restProps } = props

	return (
		<SearchField.Input
			className={mergeClassName(GLASS_INNER_INPUT_CLASS_NAME, className)}
			multiline={multiline}
			style={[
				glassInnerInputStyle,
				{ textAlignVertical: getGlassInputTextAlignVertical(multiline) },
				style,
			]}
			variant={variant ?? 'secondary'}
			{...restProps}
		/>
	)
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
				{
					alignItems: 'stretch',
					justifyContent: 'center',
					minHeight: GLASS_INPUT_MIN_HEIGHT,
					width: '100%',
				},
				style,
				contentContainerStyle,
			]}
			fallbackClassName='overflow-hidden rounded-2xl border border-border bg-surface'
			style={[
				{ borderRadius: 16, minHeight: GLASS_INPUT_MIN_HEIGHT, width: '100%' },
				style,
			]}
		>
			{children}
		</GlassWrapper>
	)
}

export const GlassInput = forwardRef<TextInput, InputProps>(function GlassInput(
	{ style, ...props },
	ref,
) {
	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()
	const { inputStyle, shellStyle } = splitGlassInputStyle(
		style as StyleProp<ViewStyle>,
	)

	if (useGlass) {
		return (
			<GlassInputShell style={shellStyle}>
				<GlassShellInput ref={ref} style={inputStyle} {...props} />
			</GlassInputShell>
		)
	}

	return (
		<Input
			ref={ref}
			className={mergeClassName(FALLBACK_INPUT_CLASS_NAME, props.className)}
			style={style}
			variant={props.variant}
			{...props}
		/>
	)
})
