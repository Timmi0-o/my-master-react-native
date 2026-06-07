import type { ReactElement, ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import { mergeContentContainerInsets } from '../../helpers/merge-content-container-insets'

interface IBasePageStaticBodyProps {
	adjustForKeyboard: boolean
	applyContentInsets: boolean
	children: ReactNode
	contentInsetBottom: number
	contentInsetTop: number
	scrollFooter: ReactNode
	scrollHeader: ReactNode
	style?: StyleProp<ViewStyle>
}

export function BasePageStaticBody({
	adjustForKeyboard,
	applyContentInsets,
	children,
	contentInsetBottom,
	contentInsetTop,
	scrollFooter,
	scrollHeader,
	style,
}: IBasePageStaticBodyProps): ReactElement {
	const content = applyContentInsets
		? mergeContentContainerInsets(
				children,
				contentInsetTop,
				contentInsetBottom,
			)
		: children

	return (
		<View
			style={style}
			{...(adjustForKeyboard ? { pointerEvents: 'box-none' as const } : {})}
		>
			{scrollHeader}
			{content}
			{scrollFooter}
		</View>
	)
}
