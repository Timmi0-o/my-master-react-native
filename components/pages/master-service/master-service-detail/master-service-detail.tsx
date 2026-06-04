import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { BookAppointmentModal } from '@/components/pages/master-service/components/modals/book-appointment-modal/book-appointment-modal'
import { BasePage } from '@/components/shared/ui/base-page'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

interface IMasterServiceDetailProps {
	service: IMasterService
}

export function MasterServiceDetail({
	service,
}: IMasterServiceDetailProps): ReactElement {
	const router = useRouter()
	const { mode } = useActiveProfileMode()
	const mutedColor = useThemeColor('muted')
	const masterProfile = service.masterProfile
	const [isBookingModalVisible, setIsBookingModalVisible] = useState(false)
	const isClientMode = mode === 'client'

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
						<Text className='text-2xl font-bold text-foreground'>
							{service.name}
						</Text>
						<Chip color='accent' variant='soft'>
							{service.price} ₽
						</Chip>
					</Card.Header>

					<Card.Body className='mt-2 gap-3 p-0'>
						{service.description ? (
							<DetailInfoRow
								icon='document-text-outline'
								label='Описание'
								value={service.description}
							/>
						) : null}
						{service.durationMinutes != null ? (
							<DetailInfoRow
								icon='time-outline'
								label='Длительность'
								value={`${service.durationMinutes} мин`}
							/>
						) : null}
						<DetailInfoRow
							icon='wallet-outline'
							label='Стоимость'
							value={`${service.price} ₽`}
						/>
					</Card.Body>
				</Card>

				{masterProfile ? (
					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>Мастер</Text>
						</Card.Header>
						<Card.Body className='mt-2 gap-3 p-0'>
							<Pressable
								accessibilityRole='button'
								className='flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:opacity-80'
								onPress={() => router.push(`/master/${masterProfile.id}`)}
							>
								<Avatar alt={masterProfile.displayName} color='accent'>
									<Avatar.Fallback>
										{masterProfile.displayName.trim()[0]?.toUpperCase() ??
											'?'}
									</Avatar.Fallback>
								</Avatar>

								<View className='flex-1 gap-1'>
									<Text className='text-base font-semibold text-foreground'>
										{masterProfile.displayName}
									</Text>
									<View className='flex-row items-center gap-1'>
										<Ionicons name='star' size={16} color={mutedColor} />
										<Text className='text-sm text-foreground'>
											{masterProfile.rating}
										</Text>
									</View>
									{masterProfile.description ? (
										<Text className='text-sm text-muted' numberOfLines={2}>
											{masterProfile.description}
										</Text>
									) : null}
								</View>

								<Ionicons
									name='chevron-forward'
									size={20}
									color={mutedColor}
								/>
							</Pressable>
						</Card.Body>
					</Card>
				) : null}

				{isClientMode ? (
					<Button
						className='rounded-2xl'
						onPress={() => setIsBookingModalVisible(true)}
						variant='primary'
					>
						<Ionicons name='calendar-outline' size={20} color='white' />
						<Button.Label>Записаться</Button.Label>
					</Button>
				) : null}
			</View>

			{isClientMode ? (
				<BookAppointmentModal
					isVisible={isBookingModalVisible}
					onClose={() => setIsBookingModalVisible(false)}
					service={service}
				/>
			) : null}
		</BasePage>
	)
}

interface IDetailInfoRowProps {
	icon: keyof typeof Ionicons.glyphMap
	label: string
	value: string
}

function DetailInfoRow({
	icon,
	label,
	value,
}: IDetailInfoRowProps): ReactElement {
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
