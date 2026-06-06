import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { IconifyIcon } from '@huymobile/react-native-iconify'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { Stack, useRouter, type Href } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

interface IBackButtonProps {
	href?: Href
}

export function BackButton({ href }: IBackButtonProps): ReactElement {
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
				style={{ marginLeft: -7 }}
				name='ion:chevron-back'
				size={20}
			/>
			<Text className='text-base' style={{ color: accentColor }}>
				{tBtn('back')}
			</Text>
		</>
	)

	const button = useGlass ? (
		<Pressable
			accessibilityRole='button'
			onPress={handlePress}
			style={{ alignSelf: 'flex-start', zIndex: 1000 }}
		>
			<GlassView
				isInteractive
				glassEffectStyle='regular'
				style={{
					alignItems: 'center',
					alignSelf: 'flex-start',
					borderRadius: 999,
					flexDirection: 'row',
					paddingHorizontal: 12,
					paddingVertical: 8,
				}}
			>
				{label}
			</GlassView>
		</Pressable>
	) : (
		<Pressable
			accessibilityRole='button'
			className='flex-row items-center py-1 active:opacity-60'
			hitSlop={{ bottom: 8, left: 4, right: 8, top: 8 }}
			onPress={handlePress}
			style={{ alignSelf: 'flex-start', zIndex: 1000 }}
		>
			{label}
		</Pressable>
	)

	return (
		<>
			<Stack.Header hidden />
			<View className='self-start'>{button}</View>
		</>
	)
}
