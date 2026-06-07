import type { ReactElement, ReactNode } from 'react'
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native'

type TOverlayPlacement = 'top' | 'bottom'

interface IBasePageOverlaySlotProps {
	children: ReactNode
	onLayout?: (height: number) => void
	placement: TOverlayPlacement
	style?: StyleProp<ViewStyle>
}

export function BasePageOverlaySlot({
	children,
	onLayout,
	placement,
	style,
}: IBasePageOverlaySlotProps): ReactElement {
	const handleLayout = (event: LayoutChangeEvent): void => {
		onLayout?.(event.nativeEvent.layout.height)
	}

	return (
		<View
			onLayout={onLayout != null ? handleLayout : undefined}
			pointerEvents='box-none'
			style={[
				{
					left: 0,
					position: 'absolute',
					right: 0,
					zIndex: 11,
					...(placement === 'top' ? { top: 0 } : { bottom: 0 }),
				},
				style,
			]}
		>
			{children}
		</View>
	)
}
