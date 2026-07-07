import type {
	NavigationTabIconProps,
	NavigationTabLabelProps,
	NavigationTabRootProps,
	NavigationTabTriggerProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { NAVIGATION_TAB_SCREEN_NAMES } from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { AndroidFloatingTabBarBackground } from '@/components/shared/ui/navigation-tab/android-floating-tab-bar-background'
import { AndroidTabBarButton } from '@/components/shared/ui/navigation-tab/android-tab-bar-button'
import {
	FLOATING_TAB_BAR_BORDER_RADIUS,
	FLOATING_TAB_BAR_BOTTOM_OFFSET,
	FLOATING_TAB_BAR_HEIGHT,
	FLOATING_TAB_BAR_HORIZONTAL_INSET,
	FLOATING_TAB_BAR_ICON_SIZE,
} from '@/components/shared/ui/navigation-tab/constants/floating-tab-bar.constants'
import { createNavigationTabCompound } from '@/components/shared/ui/navigation-tab/create-navigation-tab-compound'
import { FloatingTabBarContentExtensionProvider } from '@/components/shared/ui/navigation-tab/floating-tab-bar-content-context'
import { extractTabTriggers } from '@/components/shared/ui/navigation-tab/utils/extract-tab-triggers'
import { resolveIonIconName } from '@/components/shared/ui/navigation-tab/utils/resolve-ion-icon-name'
import { Ionicons } from '@expo/vector-icons'
import { BlurTargetView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { useMemo, useRef, type ReactElement } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function NavigationTabRoot({
	children,
}: NavigationTabRootProps): ReactElement {
	const tabs = useMemo(
		() =>
			extractTabTriggers(
				children,
				NavigationTabTrigger,
				NavigationTabLabel,
				NavigationTabIcon,
			),
		[children],
	)

	const visibleTabNames = useMemo(
		() => new Set(tabs.map((tab) => tab.name)),
		[tabs],
	)

	const tabOptionsByName = useMemo(
		() => new Map(tabs.map((tab) => [tab.name, tab])),
		[tabs],
	)

	const insets = useSafeAreaInsets()
	const blurTargetRef = useRef<View>(null)

	const [accentColor, mutedColor] = useThemeColor(['accent', 'muted'])

	return (
		<FloatingTabBarContentExtensionProvider>
			<BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
				<Tabs
					screenOptions={{
						animation: 'none',
						headerShown: false,
						tabBarActiveTintColor: accentColor,
						tabBarInactiveTintColor: mutedColor,
						tabBarActiveBackgroundColor: 'transparent',
						tabBarBackground: () => (
							<AndroidFloatingTabBarBackground blurTarget={blurTargetRef} />
						),
						tabBarButton: (props) => <AndroidTabBarButton {...props} />,
						tabBarItemStyle: {
							justifyContent: 'center',
							minHeight: 48,
							paddingVertical: 0,
						},
						tabBarShowLabel: false,
						tabBarStyle: {
							position: 'absolute',
							left: 0,
							right: 0,
							marginHorizontal: FLOATING_TAB_BAR_HORIZONTAL_INSET,
							bottom: insets.bottom + FLOATING_TAB_BAR_BOTTOM_OFFSET,
							height: FLOATING_TAB_BAR_HEIGHT,
							borderRadius: FLOATING_TAB_BAR_BORDER_RADIUS,
							borderTopWidth: 0,
							backgroundColor: 'transparent',
							paddingBottom: 0,
							paddingHorizontal: 0,
							paddingTop: 0,
							elevation: 0,
							overflow: 'hidden',
							shadowOpacity: 0,
						},
					}}
				>
				{NAVIGATION_TAB_SCREEN_NAMES.map((name) => {
					const tab = tabOptionsByName.get(name)

					if (!visibleTabNames.has(name)) {
						return (
							<Tabs.Screen
								key={name}
								name={name}
								options={{
									href: null,
								}}
							/>
						)
					}

					return (
						<Tabs.Screen
							key={name}
							name={name}
							options={{
								tabBarIcon: ({ focused, color }) => (
									<Ionicons
										color={color}
										name={resolveIonIconName(tab?.icon, focused)}
										size={FLOATING_TAB_BAR_ICON_SIZE}
									/>
								),
							}}
						/>
					)
				})}
				</Tabs>
			</BlurTargetView>
		</FloatingTabBarContentExtensionProvider>
	)
}

export function NavigationTabTrigger(_props: NavigationTabTriggerProps): null {
	return null
}

export function NavigationTabLabel(_props: NavigationTabLabelProps): null {
	return null
}

export function NavigationTabIcon(_props: NavigationTabIconProps): null {
	return null
}

NavigationTabTrigger.Label = NavigationTabLabel
NavigationTabTrigger.Icon = NavigationTabIcon

export const NavigationTab = createNavigationTabCompound(
	NavigationTabRoot,
	NavigationTabTrigger,
)
