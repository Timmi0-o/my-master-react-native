import type { ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native'

function resolvePadding(
	flat: ViewStyle,
	side: 'Top' | 'Bottom',
): number {
	const sideKey = side === 'Top' ? 'paddingTop' : 'paddingBottom'
	const sideValue = flat[sideKey]
	if (typeof sideValue === 'number') {
		return sideValue
	}

	const vertical = flat.paddingVertical
	if (typeof vertical === 'number') {
		return vertical
	}

	const padding = flat.padding
	if (typeof padding === 'number') {
		return padding
	}

	return 0
}

export function mergeContentContainerInsets(
	children: ReactNode,
	contentInsetTop: number,
	contentInsetBottom: number,
): ReactNode {
	if (contentInsetTop <= 0 && contentInsetBottom <= 0) {
		return children
	}

	const child = Children.only(children)

	if (!isValidElement<{ contentContainerStyle?: StyleProp<ViewStyle> }>(child)) {
		return children
	}

	const existing = child.props.contentContainerStyle
	const flat = StyleSheet.flatten(existing) ?? {}

	return cloneElement(child, {
		contentContainerStyle: [
			existing,
			{
				paddingTop: resolvePadding(flat, 'Top') + contentInsetTop,
				paddingBottom: resolvePadding(flat, 'Bottom') + contentInsetBottom,
			},
		],
	})
}
