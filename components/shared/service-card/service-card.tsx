import { IRecommendedService } from '@/actions/service/models/service.schema'
import { formatServiceMasterName } from '@/helpers/service/format-service-master-name'
import { Ionicons } from '@expo/vector-icons'
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
}

export function ServiceCard({
	service,
	style,
}: IServiceCardProps): ReactElement {
	const mutedColor = useThemeColor('muted')
	const masterName = formatServiceMasterName(service.master)

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			style={style}
		>
			<View className='gap-3'>
				<Text className='text-base font-semibold text-foreground'>
					{service.name}
				</Text>

				<View className='flex-row items-center justify-between gap-3'>
					<Text className='flex-1 text-sm text-muted' numberOfLines={2}>
						{masterName}
					</Text>

					<View className='flex-row items-center gap-1'>
						<Ionicons name='star' size={16} color={mutedColor} />
						<Text className='text-sm font-medium text-foreground'>
							{service.master.rating}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	)
}
