import { IMaster } from '@/actions/master/models/master.schema'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native'

interface IMasterCardProps {
	master: IMaster
	style?: StyleProp<ViewStyle>
}

export function MasterCard({ master, style }: IMasterCardProps): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			style={style}
		>
			<View className='flex-row items-start gap-3'>
				<Avatar alt={master.name} color='accent'>
					<Avatar.Fallback>{master.name[0]}</Avatar.Fallback>
				</Avatar>

				<View className='flex-1 gap-2'>
					<View className='flex-row items-start justify-between gap-3'>
						<Text className='flex-1 text-base font-semibold text-foreground'>
							{master.name}
						</Text>

						<View className='flex-row items-center gap-1'>
							<Ionicons name='star' size={16} color={mutedColor} />
							<Text className='text-sm font-medium text-foreground'>
								{master.rating}
							</Text>
						</View>
					</View>

					<Text className='text-sm text-muted'>
						{master.reviewsCount} отзывов
					</Text>

					<View className='flex-row flex-wrap gap-2'>
						{master.services.map((service) => (
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
