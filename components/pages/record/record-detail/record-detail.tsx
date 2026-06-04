import { IRecord } from '@/actions/record/models/record.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { formatDate } from '@/utils/format-date.util'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

interface IRecordDetailProps {
	record: IRecord
}

export default function RecordDetail({
	record,
}: IRecordDetailProps): ReactElement {
	const router = useRouter()
	const mutedColor = useThemeColor('muted')
	const formattedDate = formatDate(record.date)

	return (
		<BasePage>
			<View style={{ rowGap: 20 }}>
				<Button
					className='self-start'
					onPress={() => router.back()}
					size='sm'
					variant='ghost'
				>
					<Ionicons name='arrow-back' size={20} color={mutedColor} />
					<Button.Label>Назад</Button.Label>
				</Button>

				<Card className='rounded-none shadow-none bg-background-secondary'>
					<Card.Header className='gap-3'>
						<View className='flex-row items-start justify-between gap-3'>
							<View className='flex-1 gap-2'>
								<Text className='text-2xl font-bold text-foreground'>
									{record.name}
								</Text>
								<Chip color='accent' variant='soft'>
									{record.service.name}
								</Chip>
							</View>

							<View className='items-center rounded-2xl bg-accent px-4 py-3'>
								<Text className='text-xl font-bold text-accent-foreground'>
									{formattedDate.day}
								</Text>
								<Text className='text-xs font-semibold text-accent-foreground'>
									{formattedDate.month}
								</Text>
							</View>
						</View>
					</Card.Header>

					<Card.Body className='mt-2 gap-3 p-0'>
						<RecordInfoRow
							icon='calendar-outline'
							label='Дата'
							value={formattedDate.full}
						/>
						<RecordInfoRow
							icon='time-outline'
							label='Время'
							value={record.time}
						/>
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>Клиент</Text>
					</Card.Header>
					<Card.Body className='mt-2 gap-3 p-0'>
						<View className='flex-row items-center gap-3'>
							<Avatar alt={record.client.name} color='accent'>
								<Avatar.Fallback>{record.client.name[0]}</Avatar.Fallback>
							</Avatar>
							<Text className='text-lg font-semibold text-foreground'>
								{record.client.name}
							</Text>
						</View>
						<RecordInfoRow
							icon='call-outline'
							label='Телефон'
							value={record.client.phone}
						/>
						<RecordInfoRow
							icon='mail-outline'
							label='Email'
							value={record.client.email}
						/>
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>Услуга</Text>
					</Card.Header>
					<Card.Body className='mt-2 p-0'>
						<RecordInfoRow
							icon='briefcase-outline'
							label='Название'
							value={record.service.name}
						/>
					</Card.Body>
				</Card>
			</View>
		</BasePage>
	)
}

interface IRecordInfoRowProps {
	icon: keyof typeof Ionicons.glyphMap
	label: string
	value: string
}

function RecordInfoRow({
	icon,
	label,
	value,
}: IRecordInfoRowProps): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<View className='flex-row items-center gap-3 rounded-xl bg-surface px-3 py-3'>
			<Ionicons name={icon} size={20} color={mutedColor} />
			<View className='flex-1 gap-0.5'>
				<Text className='text-xs text-muted'>{label}</Text>
				<Text className='text-base text-foreground'>{value}</Text>
			</View>
		</View>
	)
}
