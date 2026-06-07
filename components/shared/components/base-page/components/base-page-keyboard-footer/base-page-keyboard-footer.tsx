import type { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'
import { BASE_PAGE_FOOTER_PADDING_TOP } from '../../constants/base-page.constants'

interface IBasePageKeyboardFooterProps {
	backgroundColor: string
	children: ReactNode
	paddingLeft: number
	paddingRight: number
}

export function BasePageKeyboardFooter({
	backgroundColor,
	children,
	paddingLeft,
	paddingRight,
}: IBasePageKeyboardFooterProps): ReactElement {
	return (
		<View
			style={{
				backgroundColor,
				paddingLeft,
				paddingRight,
				paddingTop: BASE_PAGE_FOOTER_PADDING_TOP,
			}}
		>
			{children}
		</View>
	)
}
