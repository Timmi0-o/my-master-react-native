import type { ReactElement, ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import type { ScrollHandlerProcessed } from 'react-native-reanimated'
import type { IBasePageLayoutState } from '../../base-page.types'
import { BasePageKeyboardFooter } from '../base-page-keyboard-footer/base-page-keyboard-footer'
import { BasePageScrollBody } from '../base-page-scroll-body/base-page-scroll-body'
import { BasePageScrollFooter } from '../base-page-scroll-slot/base-page-scroll-slot'
import { BasePageStaticBody } from '../base-page-static-body/base-page-static-body'

interface IBasePageMainColumnProps {
	adjustForKeyboard: boolean
	backgroundColor: string
	children: ReactNode
	contentContainerStyle?: StyleProp<ViewStyle>
	footerContent?: ReactNode
	hasRefresh: boolean
	headerContent?: ReactNode
	layout: IBasePageLayoutState
	onRefresh?: () => void
	onScroll?: ScrollHandlerProcessed<Record<string, unknown>>
	refreshing: boolean
	scrollEnabled: boolean
	style?: StyleProp<ViewStyle>
	edgesIncludeBottom: boolean
	insetsBottom: number
}

export function BasePageMainColumn({
	adjustForKeyboard,
	backgroundColor,
	children,
	contentContainerStyle,
	footerContent,
	hasRefresh,
	headerContent,
	layout,
	onRefresh,
	onScroll,
	refreshing,
	scrollEnabled,
	style,
	edgesIncludeBottom,
	insetsBottom,
}: IBasePageMainColumnProps): ReactElement {
	const {
		hasFixedHeader,
		hasScrollFooter,
		hasScrollHeader,
		headerSlotStyle,
		paddingLeft,
		paddingRight,
		paddingTop,
		headerPaddingTop,
		scrollPaddingBottom,
		useKeyboardAvoidingFooter,
	} = layout

	const scrollHeader =
		hasScrollHeader && headerContent != null ? (
			<View style={headerSlotStyle}>{headerContent}</View>
		) : null

	const scrollFooter =
		hasScrollFooter && footerContent != null ? (
			<BasePageScrollFooter
				paddingBottom={edgesIncludeBottom ? insetsBottom : 0}
			>
				{footerContent}
			</BasePageScrollFooter>
		) : null

	const scrollContentStyle = [
		{
			backgroundColor,
			flexGrow: 1,
			paddingBottom: scrollPaddingBottom,
			paddingLeft,
			paddingRight,
			paddingTop,
		},
		contentContainerStyle,
	]

	const staticContentStyle = [
		{
			backgroundColor,
			flex: 1,
			paddingLeft,
			paddingRight,
			paddingTop,
		},
		contentContainerStyle,
	]

	return (
		<>
			{hasFixedHeader && headerContent != null ? (
				<View style={{ ...headerSlotStyle, zIndex: 11 }}>{headerContent}</View>
			) : null}

			{scrollEnabled ? (
				<BasePageScrollBody
					adjustForKeyboard={adjustForKeyboard}
					backgroundColor={backgroundColor}
					contentContainerStyle={scrollContentStyle}
					hasFixedHeader={hasFixedHeader}
					hasRefresh={hasRefresh}
					headerPaddingTop={headerPaddingTop}
					onRefresh={onRefresh}
					onScroll={onScroll}
					paddingTop={paddingTop}
					refreshing={refreshing}
					scrollFooter={scrollFooter}
					scrollHeader={scrollHeader}
					style={style}
					useKeyboardAvoidingFooter={useKeyboardAvoidingFooter}
				>
					{children}
				</BasePageScrollBody>
			) : (
				<BasePageStaticBody
					adjustForKeyboard={adjustForKeyboard}
					scrollFooter={scrollFooter}
					scrollHeader={scrollHeader}
					style={[staticContentStyle, style]}
				>
					{children}
				</BasePageStaticBody>
			)}

			{useKeyboardAvoidingFooter && footerContent != null ? (
				<BasePageKeyboardFooter
					backgroundColor={backgroundColor}
					paddingLeft={paddingLeft}
					paddingRight={paddingRight}
				>
					{footerContent}
				</BasePageKeyboardFooter>
			) : null}
		</>
	)
}
