import { IRecord } from '@/actions/record/models/record.schema'
import { formatRecordDate } from '@/helpers/record/format-record-date'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import {
	Pressable,
	Text,
	View,
	type StyleProp,
	type ViewStyle,
} from 'react-native'

interface IRecordCardProps {
	record: IRecord
	style?: StyleProp<ViewStyle>
	onBeforeNavigate?: () => void
}

export function RecordCard({
	record,
	style,
	onBeforeNavigate,
}: IRecordCardProps): ReactElement {
	const router = useRouter()
	const [accentColor, accentForegroundColor, mutedColor] = useThemeColor([
		'accent',
		'accent-foreground',
		'muted',
	])

	const formattedDate = formatRecordDate(record.date)

	const handlePress = (): void => {
		onBeforeNavigate?.()
		router.push(`/record/${record.id}`)
	}

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-background-secondary p-4 active:opacity-80'
			onPress={handlePress}
			style={style}
		>
			<View className='flex-row items-start gap-3'>
				<View
					className='items-center justify-center rounded-2xl px-3 py-2'
					style={{ backgroundColor: accentColor }}
				>
					<Text
						className='text-lg font-bold'
						style={{ color: accentForegroundColor }}
					>
						{formattedDate.day}
					</Text>
					<Text
						className='text-xs font-semibold'
						style={{ color: accentForegroundColor }}
					>
						{formattedDate.month}
					</Text>
				</View>

				<View className='flex-1 gap-2'>
					<View className='flex-row items-start justify-between gap-3'>
						<View className='flex-1'>
							<Text className='text-base font-semibold text-foreground'>
								{record.name}
							</Text>
							<View className='mt-1 flex-row items-center gap-1.5'>
								<Ionicons name='time-outline' size={16} color={mutedColor} />
								<Text className='text-sm text-muted'>{record.time}</Text>
							</View>
						</View>

						<Chip variant='soft' color='accent'>
							{record.service.name}
						</Chip>
					</View>

					<View className='flex-row items-center gap-2 rounded-xl bg-surface px-3 py-2'>
						<Ionicons name='person-outline' size={16} color={mutedColor} />
						<Text className='flex-1 text-sm text-foreground'>
							{record.client.name}
						</Text>
					</View>

					<View className='flex-row items-center gap-2 rounded-xl bg-surface px-3 py-2'>
						<Ionicons name='calendar-outline' size={16} color={mutedColor} />
						<Text className='text-sm text-foreground'>{formattedDate.full}</Text>
					</View>
				</View>
			</View>
		</Pressable>
	)
}
