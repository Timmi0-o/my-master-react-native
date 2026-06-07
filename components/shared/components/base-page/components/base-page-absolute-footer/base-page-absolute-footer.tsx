import type { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'
import { BASE_PAGE_FOOTER_PADDING_TOP } from '../../constants/base-page.constants'

interface IBasePageAbsoluteFooterProps {
	children: ReactNode
	paddingLeft: number
	paddingRight: number
}

export function BasePageAbsoluteFooter({
	children,
	paddingLeft,
	paddingRight,
}: IBasePageAbsoluteFooterProps): ReactElement {
	return (
		<View
			style={{
				bottom: 0,
				left: 0,
				paddingLeft,
				paddingRight,
				paddingTop: BASE_PAGE_FOOTER_PADDING_TOP,
				position: 'absolute',
				right: 0,
				zIndex: 11,
			}}
		>
			{children}
		</View>
	)
}
