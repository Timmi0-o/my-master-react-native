import type { ReactElement, ReactNode } from 'react'
import { Platform, RefreshControl, type StyleProp, type ViewStyle } from 'react-native'
import Animated, { type ScrollHandlerProcessed } from 'react-native-reanimated'
import { useThemeColor } from 'heroui-native'

interface IBasePageScrollBodyProps {
	adjustForKeyboard: boolean
	backgroundColor: string
	children: ReactNode
	contentContainerStyle: StyleProp<ViewStyle>
	hasFixedHeader: boolean
	hasRefresh: boolean
	headerPaddingTop: number
	onRefresh?: () => void
	onScroll?: ScrollHandlerProcessed<Record<string, unknown>>
	paddingTop: number
	refreshing: boolean
	scrollFooter: ReactNode
	scrollHeader: ReactNode
	style?: StyleProp<ViewStyle>
	useKeyboardAvoidingFooter: boolean
}

export function BasePageScrollBody({
	adjustForKeyboard,
	backgroundColor,
	children,
	contentContainerStyle,
	hasFixedHeader,
	hasRefresh,
	headerPaddingTop,
	onRefresh,
	onScroll,
	paddingTop,
	refreshing,
	scrollFooter,
	scrollHeader,
	style,
	useKeyboardAvoidingFooter,
}: IBasePageScrollBodyProps): ReactElement {
	const accentColor = useThemeColor('accent')

	return (
		<Animated.ScrollView
			alwaysBounceVertical={hasRefresh ? true : undefined}
			automaticallyAdjustKeyboardInsets={
				adjustForKeyboard && !useKeyboardAvoidingFooter && Platform.OS === 'ios'
			}
			contentContainerStyle={contentContainerStyle}
			keyboardShouldPersistTaps={adjustForKeyboard ? 'handled' : undefined}
			onScroll={onScroll}
			refreshControl={
				Platform.OS === 'android' && hasRefresh ? (
					<RefreshControl
						colors={[accentColor]}
						onRefresh={onRefresh}
						progressViewOffset={hasFixedHeader ? headerPaddingTop : paddingTop}
						refreshing={refreshing}
						tintColor={accentColor}
					/>
				) : undefined
			}
			scrollEventThrottle={16}
			style={[{ backgroundColor, flex: 1 }, style]}
		>
			{scrollHeader}
			{children}
			{scrollFooter}
		</Animated.ScrollView>
	)
}
