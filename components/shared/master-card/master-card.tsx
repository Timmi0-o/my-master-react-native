import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native'

interface IMasterCardProps {
	master: IMasterProfile
	style?: StyleProp<ViewStyle>
	onBeforeNavigate?: () => void
}

export function MasterCard({
	master,
	style,
	onBeforeNavigate,
}: IMasterCardProps): ReactElement {
	const router = useRouter()
	const mutedColor = useThemeColor('muted')
	const services = master.services ?? []

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/master/${master.id}`)
	}

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			onPress={handlePress}
			style={style}
		>
			<View className='flex-row items-start gap-3'>
				<Avatar alt={master.displayName} color='accent'>
					<Avatar.Fallback>{master.displayName[0]}</Avatar.Fallback>
				</Avatar>

				<View className='flex-1 gap-2'>
					<View className='flex-row items-start justify-between gap-3'>
						<Text className='flex-1 text-base font-semibold text-foreground'>
							{master.displayName}
						</Text>

						<View className='flex-row items-center gap-1'>
							<Ionicons name='star' size={16} color={mutedColor} />
							<Text className='text-sm font-medium text-foreground'>
								{master.rating}
							</Text>
						</View>
					</View>

					<Text className='text-sm text-muted' numberOfLines={2}>
						{master.description}
					</Text>

					<View className='flex-row flex-wrap gap-2'>
						{services.map((service) => (
							<Chip key={service.id} variant='soft' color='accent'>
								{service.name}
							</Chip>
						))}
					</View>
				</View>
			</View>
		</Pressable>
	)
}
