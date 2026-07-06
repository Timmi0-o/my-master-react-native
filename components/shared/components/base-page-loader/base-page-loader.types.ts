import { StyleProp, ViewStyle } from 'react-native'

export type BasePageLoaderVariant =
	| 'default'
	| 'hub'
	| 'list'
	| 'form'
	| 'profile'

export interface IBasePageLoaderProps {
	variant?: BasePageLoaderVariant
	itemCount?: number
	fieldCount?: number
	showHeader?: boolean
	showHeaderRightAction?: boolean
	className?: string
	style?: StyleProp<ViewStyle>
}
