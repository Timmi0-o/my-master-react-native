import type { ReactElement, ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

interface IBasePageStaticBodyProps {
	adjustForKeyboard: boolean
	children: ReactNode
	scrollFooter: ReactNode
	scrollHeader: ReactNode
	style?: StyleProp<ViewStyle>
}

export function BasePageStaticBody({
	adjustForKeyboard,
	children,
	scrollFooter,
	scrollHeader,
	style,
}: IBasePageStaticBodyProps): ReactElement {
	return (
		<View
			style={style}
			{...(adjustForKeyboard ? { pointerEvents: 'box-none' as const } : {})}
		>
			{scrollHeader}
			{children}
			{scrollFooter}
		</View>
	)
}
