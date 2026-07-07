import type {
	NavigationTabIconProps,
	NavigationTabLabelProps,
	NavigationTabRootProps,
	NavigationTabTriggerProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { createNavigationTabCompound } from '@/components/shared/ui/navigation-tab/create-navigation-tab-compound'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'

export function NavigationTabRoot({
	children,
	blurEffect = 'systemDefault',
	minimizeBehavior = 'automatic',
}: NavigationTabRootProps): ReactElement {
	const [accentColor, mutedColor] = useThemeColor(['accent', 'muted'])

	return (
		<NativeTabs
			blurEffect={blurEffect}
			iconColor={{ default: mutedColor, selected: accentColor }}
			labelVisibilityMode='unlabeled'
			minimizeBehavior={minimizeBehavior}
			tintColor={accentColor}
		>
			{children}
		</NativeTabs>
	)
}

export function NavigationTabTrigger({
	name,
	children,
}: NavigationTabTriggerProps): ReactElement {
	return <NativeTabs.Trigger name={name}>{children}</NativeTabs.Trigger>
}

export function NavigationTabLabel({
	children,
	hidden,
	selectedStyle,
}: NavigationTabLabelProps): ReactElement {
	return (
		<NativeTabs.Trigger.Label hidden={hidden} selectedStyle={selectedStyle}>
			{children}
		</NativeTabs.Trigger.Label>
	)
}

export function NavigationTabIcon(props: NavigationTabIconProps): ReactElement {
	return <NativeTabs.Trigger.Icon {...props} />
}

NavigationTabTrigger.Label = NavigationTabLabel
NavigationTabTrigger.Icon = NavigationTabIcon

export const NavigationTab = createNavigationTabCompound(
	NavigationTabRoot,
	NavigationTabTrigger,
)
