import { Platform, UIManager } from 'react-native'

export function isOverlayBlurAvailable(): boolean {
	if (Platform.OS === 'web') {
		return false
	}

	const viewConfig =
		UIManager.getViewManagerConfig?.('ExpoBlur_ExpoBlurView') ??
		UIManager.getViewManagerConfig?.('ExpoBlurView')

	return viewConfig != null
}
