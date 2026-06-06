import { BackButton } from '@/components/shared/ui/back-button/back-button'
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
	return (
		<View className='mb-4 flex-row items-center gap-2'>
			<BackButton />
			<Text className='flex-1 text-xl font-bold text-foreground'>{title}</Text>
			{extraContent}
		</View>
	)
}
