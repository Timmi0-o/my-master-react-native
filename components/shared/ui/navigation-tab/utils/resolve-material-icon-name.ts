import type { NavigationTabIconProps } from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export type MaterialIconName = keyof typeof MaterialIcons.glyphMap

const MATERIAL_ICON_ALIASES: Partial<Record<string, MaterialIconName>> = {
	chat: 'chat-bubble-outline',
	home_filled: 'home-filled',
	house: 'home',
	magnifyingglass: 'search',
	message: 'chat-bubble',
	gearshape: 'settings',
}

const resolveMdIconName = (
	icon: NavigationTabIconProps['md'],
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

const toMaterialIconName = (rawName: string): MaterialIconName | undefined => {
	const candidates = [
		rawName,
		rawName.replace(/_/g, '-'),
		MATERIAL_ICON_ALIASES[rawName],
	].filter((value): value is string => Boolean(value))

	for (const candidate of candidates) {
		if (candidate in MaterialIcons.glyphMap) {
			return candidate as MaterialIconName
		}
	}

	return undefined
}

export const resolveMaterialIconName = (
	icon: NavigationTabIconProps | undefined,
	focused: boolean,
): MaterialIconName => {
	const mdIcon = resolveMdIconName(icon?.md, focused)

	if (mdIcon) {
		return toMaterialIconName(mdIcon) ?? 'home'
	}

	return 'home'
}
