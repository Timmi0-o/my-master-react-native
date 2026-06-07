import type { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'
import { BASE_PAGE_FOOTER_PADDING_TOP } from '../../constants/base-page.constants'

interface IBasePageScrollFooterProps {
	children: ReactNode
	paddingBottom: number
}

export function BasePageScrollFooter({
	children,
	paddingBottom,
}: IBasePageScrollFooterProps): ReactElement {
	return (
		<View
			style={{
				paddingBottom,
				paddingTop: BASE_PAGE_FOOTER_PADDING_TOP,
			}}
		>
			{children}
		</View>
	)
}
