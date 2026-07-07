import type { AndroidSymbol } from 'expo-symbols'
import type MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import type { StyleProp, TextStyle } from 'react-native'
import type { SFSymbol } from 'sf-symbols-typescript'

export type MaterialIconName = keyof typeof MaterialIcons.glyphMap
export type IonIconName = keyof typeof Ionicons.glyphMap

export type NavigationTabLabelStyle = Pick<
	TextStyle,
	'fontFamily' | 'fontSize' | 'fontStyle' | 'fontWeight' | 'color'
>

export type NavigationTabIconState<T extends string> = {
	default?: T
	selected: T
}

export type NavigationTabIconProps = {
	sf?: NavigationTabIconState<SFSymbol> | SFSymbol
	ion?: NavigationTabIconState<IonIconName> | IonIconName
	md?: NavigationTabIconState<MaterialIconName> | MaterialIconName
}

export type NavigationTabTriggerProps = {
	name: string
	children?: ReactNode
}

export type NavigationTabLabelProps = {
	children?: string
	hidden?: boolean
	selectedStyle?: StyleProp<NavigationTabLabelStyle>
}

export type ExtractedNavigationTabTrigger = {
	name: string
	label: string
	icon: NavigationTabIconProps
}

export const NAVIGATION_TAB_SCREEN_NAMES = [
	'general/index',
	'search/index',
	'chats/index',
	'index',
	'settings/index',
] as const

export type NavigationTabRootProps = {
	children: ReactNode
	blurEffect?: 'systemDefault' | 'none' | 'extraLight' | 'light' | 'dark' | 'regular' | 'prominent'
	minimizeBehavior?: 'automatic' | 'never' | 'onScrollDown' | 'onScrollUp'
}
