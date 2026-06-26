import type {
	NavigationTabIconProps,
	NavigationTabLabelProps,
	NavigationTabRootProps,
	NavigationTabTriggerProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { NAVIGATION_TAB_SCREEN_NAMES } from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { AndroidTabBarButton } from '@/components/shared/ui/navigation-tab/android-tab-bar-button'
import { createNavigationTabCompound } from '@/components/shared/ui/navigation-tab/create-navigation-tab-compound'
import { extractTabTriggers } from '@/components/shared/ui/navigation-tab/utils/extract-tab-triggers'
import { resolveMaterialIconName } from '@/components/shared/ui/navigation-tab/utils/resolve-material-icon-name'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import { useMemo, type ReactElement } from 'react'

const TAB_ICON_SIZE = 24

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

	const [accentColor, mutedColor, backgroundColor] = useThemeColor([
		'accent',
		'muted',
		'background',
	])

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: accentColor,
				tabBarInactiveTintColor: mutedColor,
				tabBarActiveBackgroundColor: 'transparent',
				tabBarButton: (props) => <AndroidTabBarButton {...props} />,
				tabBarItemStyle: {
					minHeight: 48,
					paddingVertical: 4,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					marginTop: 2,
				},
				tabBarStyle: {
					backgroundColor,
					borderTopColor: mutedColor,
					borderTopWidth: 0.5,
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
							title: tab?.label ?? '',
							tabBarIcon: ({ focused, color }) => (
								<MaterialIcons
									color={color}
									name={resolveMaterialIconName(tab?.icon, focused)}
									size={TAB_ICON_SIZE}
								/>
							),
						}}
					/>
				)
			})}
		</Tabs>
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
