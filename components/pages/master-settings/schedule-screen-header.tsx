import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Button, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

interface IScheduleScreenHeaderProps {
	title: string
	extraContent?: ReactElement
}

export function ScheduleScreenHeader({
	title,
	extraContent,
}: IScheduleScreenHeaderProps): ReactElement {
	const router = useRouter()
	const foregroundColor = useThemeColor('foreground')

	return (
		<View className='mb-4 flex-row items-center gap-2 px-2'>
			<Button
				isIconOnly
				variant='ghost'
				size='sm'
				onPress={() => router.back()}
			>
				<Ionicons name='chevron-back' size={24} color={foregroundColor} />
			</Button>
			<Text className='flex-1 text-xl font-bold text-foreground'>{title}</Text>
			{extraContent}
		</View>
	)
}
