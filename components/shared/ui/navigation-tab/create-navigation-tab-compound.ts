import type {
	NavigationTabIconProps,
	NavigationTabLabelProps,
	NavigationTabRootProps,
	NavigationTabTriggerProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import type { ReactElement } from 'react'

export type NavigationTabTriggerCompound = ((
	props: NavigationTabTriggerProps,
) => ReactElement | null) & {
	Label: (props: NavigationTabLabelProps) => ReactElement | null
	Icon: (props: NavigationTabIconProps) => ReactElement | null
}

export type NavigationTabCompound = ((
	props: NavigationTabRootProps,
) => ReactElement) & {
	Trigger: NavigationTabTriggerCompound
}

export const createNavigationTabCompound = <
	TRoot extends (props: NavigationTabRootProps) => ReactElement,
	TTrigger extends NavigationTabTriggerCompound,
>(
	Root: TRoot,
	Trigger: TTrigger,
): NavigationTabCompound => {
	const NavigationTab = Root as unknown as NavigationTabCompound

	NavigationTab.Trigger = Trigger

	return NavigationTab
}
