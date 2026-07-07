import {
	FLOATING_TAB_BAR_BLUR_INTENSITY,
	FLOATING_TAB_BAR_BLUR_REDUCTION_FACTOR,
	FLOATING_TAB_BAR_BORDER_RADIUS,
	FLOATING_TAB_BAR_FALLBACK_OPACITY,
} from '@/components/shared/ui/navigation-tab/constants/floating-tab-bar.constants'
import { useThemeApp } from '@/configs/theme/theme-context'
import { BlurView } from 'expo-blur'
import { useThemeColor } from 'heroui-native'
import type { ReactElement, RefObject } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

const ANDROID_MIN_BLUR_SDK = 31

interface AndroidFloatingTabBarBackgroundProps {
	blurTarget: RefObject<View | null>
}

function isAndroidBlurSupported(): boolean {
	return Platform.OS === 'android' && Platform.Version >= ANDROID_MIN_BLUR_SDK
}

export function AndroidFloatingTabBarBackground({
	blurTarget,
}: AndroidFloatingTabBarBackgroundProps): ReactElement {
	const { resolvedColorScheme } = useThemeApp()
	const [surfaceColor, backgroundColor, borderColor] = useThemeColor([
		'surface',
		'background',
		'border',
	])

	const fallbackBackgroundColor = surfaceColor ?? backgroundColor
	const showBlur = isAndroidBlurSupported()
	const blurTint =
		resolvedColorScheme === 'dark'
			? 'systemChromeMaterialDark'
			: 'systemChromeMaterialLight'

	return (
		<View
			style={[
				styles.container,
				{
					borderColor,
					borderRadius: FLOATING_TAB_BAR_BORDER_RADIUS,
				},
			]}
		>
			{showBlur ? (
				<BlurView
					blurMethod='dimezisBlurViewSdk31Plus'
					blurReductionFactor={FLOATING_TAB_BAR_BLUR_REDUCTION_FACTOR}
					blurTarget={blurTarget}
					intensity={FLOATING_TAB_BAR_BLUR_INTENSITY}
					style={StyleSheet.absoluteFill}
					tint={blurTint}
				/>
			) : (
				<View
					pointerEvents='none'
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: fallbackBackgroundColor,
							opacity: FLOATING_TAB_BAR_FALLBACK_OPACITY,
						},
					]}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFill,
		borderWidth: StyleSheet.hairlineWidth * 2,
		elevation: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { height: 4, width: 0 },
		shadowOpacity: 0.22,
		shadowRadius: 12,
	},
})
