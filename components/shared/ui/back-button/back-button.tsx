import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter, type Href } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { StyleProp, Text, type ViewStyle } from 'react-native'

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

	const handlePress = (): void => {
		if (href != null) {
			router.push(href)
			return
		}

		router.back()
	}

	return (
		<>
			<Stack.Header hidden />
			<GlassWrapper
				contentContainerStyle={{
					alignItems: 'center',
					flexDirection: 'row',
					paddingHorizontal: withoutLabel ? 10 : 12,
					paddingVertical: withoutLabel ? 10 : 8,
				}}
				onPress={handlePress}
				style={[
					{ alignSelf: 'flex-start', borderRadius: 999, zIndex: 1000 },
					style,
				]}
			>
				<Ionicons
					color={accentColor}
					name='chevron-back'
					size={22}
					style={{ marginLeft: withoutLabel ? -2 : -4 }}
				/>

				{!withoutLabel ? (
					<Text className='text-base' style={{ color: accentColor }}>
						{tBtn('back')}
					</Text>
				) : null}
			</GlassWrapper>
		</>
	)
}
