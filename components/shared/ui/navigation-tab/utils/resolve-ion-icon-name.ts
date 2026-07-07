import type {
	IonIconName,
	NavigationTabIconProps,
} from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import { Ionicons } from '@expo/vector-icons'

const resolveIonIconNameFromProps = (
	icon: NavigationTabIconProps['ion'],
	focused: boolean,
): string | undefined => {
	if (!icon) {
		return undefined
	}

	if (typeof icon === 'string') {
		return icon
	}

	return focused
		? (icon.selected ?? icon.default)
		: (icon.default ?? icon.selected)
}

const toIonIconName = (rawName: string): IonIconName | undefined => {
	if (rawName in Ionicons.glyphMap) {
		return rawName as IonIconName
	}

	return undefined
}

export const resolveIonIconName = (
	icon: NavigationTabIconProps | undefined,
	focused: boolean,
): IonIconName => {
	const ionIcon = resolveIonIconNameFromProps(icon?.ion, focused)

	if (ionIcon) {
		return toIonIconName(ionIcon) ?? 'home-outline'
	}

	return 'home-outline'
}
