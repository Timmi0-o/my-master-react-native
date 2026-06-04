import type { IRecommendedService } from '@/actions/service/models/service.schema'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import {
	Pressable,
	Text,
	View,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

interface IServiceCardProps {
	service: IRecommendedService
	style?: StyleProp<ViewStyle>
	onBeforeNavigate?: () => void
}

export function ServiceCard({
	service,
	style,
	onBeforeNavigate,
}: IServiceCardProps): ReactElement {
	const router = useRouter()
	const mutedColor = useThemeColor('muted')
	const masterProfile = service.masterProfile

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/master-service/${service.id}`)
	}

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			onPress={handlePress}
			style={style}
		>
			<View className='gap-3'>
				<Text className='text-base font-semibold text-foreground'>
					{service.name}
				</Text>

				<View className='flex-row items-center justify-between gap-3'>
					<Text className='flex-1 text-sm text-muted' numberOfLines={2}>
						{masterProfile?.displayName ?? 'Мастер'}
					</Text>

					{masterProfile ? (
						<View className='flex-row items-center gap-1'>
							<Ionicons name='star' size={16} color={mutedColor} />
							<Text className='text-sm font-medium text-foreground'>
								{masterProfile.rating}
							</Text>
						</View>
					) : null}
				</View>
			</View>
		</Pressable>
	)
}
