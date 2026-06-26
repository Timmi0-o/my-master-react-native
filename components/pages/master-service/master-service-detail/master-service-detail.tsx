import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { BookAppointmentModal } from './components/modals/book-appointment-modal/book-appointment-modal'
import { MasterServiceContent } from './components/master-service-content/master-service-content'

interface IMasterServiceDetailProps {
	service: IMasterService
}

export function MasterServiceDetail({
	service,
}: IMasterServiceDetailProps): ReactElement {
	const router = useRouter()
	const { mode } = useActiveProfileMode()

	const { t } = useScopedTranslation('pages', 'masterService')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tUi } = useScopedTranslation('ui')

	const mutedColor = useThemeColor('muted')
	const masterProfile = service.masterProfile

	const [isBookingModalVisible, setIsBookingModalVisible] = useState(false)

	const isClientMode = mode === 'client'

	return (
		<BasePage headerContent={<BackButton />}>
			<View style={{ rowGap: 20 }}>
				<Card className='rounded-none shadow-none bg-background-secondary'>
					<Card.Header className='gap-3'>
						<Text className='text-2xl font-bold text-foreground'>
							{service.name}
						</Text>
						<Chip color='accent' variant='soft'>
							{formatPriceByCurrency(service.price, ECurrency.RUB)}
						</Chip>
					</Card.Header>

					<Card.Body className='mt-2 gap-3 p-0'>
						{service.durationMinutes != null ? (
							<DetailInfoRow
								icon='time-outline'
								label={tField('duration')}
								value={tUi('durationMinutes', {
									count: service.durationMinutes,
								})}
							/>
						) : null}
						<DetailInfoRow
							icon='wallet-outline'
							label={tField('cost')}
							value={formatPriceByCurrency(service.price, ECurrency.RUB)}
						/>
					</Card.Body>
				</Card>

				<MasterServiceContent service={service} />

				{masterProfile ? (
					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>
								{t('masterSection')}
							</Text>
						</Card.Header>
						<Card.Body className='mt-2 gap-3 p-0'>
							<Pressable
								accessibilityRole='button'
								className='flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:opacity-80'
								onPress={() => router.push(`/master/${masterProfile.id}`)}
							>
								<Avatar alt={masterProfile.displayName} color='accent'>
									<Avatar.Fallback>
										{masterProfile.displayName.trim()[0]?.toUpperCase() ?? '?'}
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

								<Ionicons name='chevron-forward' size={20} color={mutedColor} />
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
						<Button.Label>{tBtn('book')}</Button.Label>
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
