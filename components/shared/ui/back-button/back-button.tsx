import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { IconifyIcon } from '@huymobile/react-native-iconify'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Stack, useRouter, type Href } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import {
	Platform,
	Pressable,
	StyleProp,
	Text,
	View,
	type ViewStyle,
} from 'react-native'

interface IBackButtonProps {
	href?: Href
	withoutLabel?: boolean
	style?: StyleProp<ViewStyle>
}

export function BackButton({
	href,
	withoutLabel = false,
	style,
}: IBackButtonProps): ReactElement {
	const router = useRouter()
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const accentColor = useThemeColor('accent')

	const useGlass = Platform.OS === 'ios' && isLiquidGlassAvailable()

	const handlePress = (): void => {
		if (href != null) {
			router.push(href)
			return
		}

		router.back()
	}

	const label = (
		<>
			<IconifyIcon
				color={accentColor}
				style={{ marginLeft: withoutLabel ? -3 : -7 }}
				name='ion:chevron-back'
				size={20}
			/>

			{!withoutLabel ? (
				<Text className='text-base' style={{ color: accentColor }}>
					{tBtn('back')}
				</Text>
			) : null}
		</>
	)

	const button = useGlass ? (
		<GlassWrapper
			contentContainerStyle={{
				alignItems: 'center',
				flexDirection: 'row',
				paddingHorizontal: 12,
				paddingVertical: withoutLabel ? 10 : 8,
			}}
			onPress={handlePress}
			style={[
				{ alignSelf: 'flex-start', borderRadius: 999, zIndex: 1000 },
				style,
			]}
		>
			{label}
		</GlassWrapper>
	) : (
		<Pressable
			accessibilityRole='button'
			className='flex-row items-center py-1 active:opacity-60'
			hitSlop={{ bottom: 8, left: 4, right: 8, top: 8 }}
			onPress={handlePress}
			style={[{ alignSelf: 'flex-start', zIndex: 1000 }, style]}
		>
			{label}
		</Pressable>
	)

	return (
		<>
			<Stack.Header hidden />
			<View>{button}</View>
		</>
	)
}
