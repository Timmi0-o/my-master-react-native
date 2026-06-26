import type { GlassViewProps } from 'expo-glass-effect'
import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface IGlassWrapperProps extends Omit<GlassViewProps, 'children'> {
	children: ReactNode
	contentContainerStyle?: StyleProp<ViewStyle>
	isDisabled?: boolean
	fallbackClassName?: string
	onPress?: () => void
}

export const GLASS_WRAPPER_FALLBACK_CLASSNAME =
	'overflow-hidden rounded-2xl border border-border bg-surface'
