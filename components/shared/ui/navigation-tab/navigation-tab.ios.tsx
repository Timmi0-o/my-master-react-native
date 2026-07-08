import type { NavigationTabCompound } from '@/components/shared/ui/navigation-tab/create-navigation-tab-compound'
import { createNavigationTabCompound } from '@/components/shared/ui/navigation-tab/create-navigation-tab-compound'
import type {
	NavigationTabIconProps,
	NavigationTabLabelProps,
	NavigationTabRootProps,
	NavigationTabTriggerProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useThemeColor } from 'heroui-native'
import type { ComponentType, ReactElement } from 'react'

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

// Must be the exact NativeTabs.Trigger component — expo-router only registers
// direct Trigger children when building the native tab navigator.
export const NavigationTabTrigger = NativeTabs.Trigger as ComponentType<
	NavigationTabTriggerProps
>

export const NavigationTabLabel = NativeTabs.Trigger.Label as ComponentType<
	NavigationTabLabelProps
>

export const NavigationTabIcon = NativeTabs.Trigger.Icon as ComponentType<
	NavigationTabIconProps
>

NavigationTabTrigger.Label = NavigationTabLabel
NavigationTabTrigger.Icon = NavigationTabIcon

export const NavigationTab = createNavigationTabCompound(
	NavigationTabRoot,
	NavigationTabTrigger as NavigationTabCompound['Trigger'],
)
