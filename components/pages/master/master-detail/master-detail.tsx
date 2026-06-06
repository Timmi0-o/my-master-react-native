import type {
	IMasterProfile,
	IMasterProfileService,
} from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'

interface IMasterDetailProps {
	master: IMasterProfile
}

export function MasterDetail({ master }: IMasterDetailProps): ReactElement {
	const router = useRouter()
	const { t } = useScopedTranslation('pages', 'master')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const mutedColor = useThemeColor('muted')
	const services = master.services ?? []

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
					<Button.Label>{tBtn('back')}</Button.Label>
				</Button>

				<Card className='rounded-none shadow-none bg-background-secondary'>
					<Card.Body className='gap-4 p-0'>
						<View className='flex-row items-start gap-3'>
							<Avatar alt={master.displayName} color='accent' size='lg'>
								<Avatar.Fallback>
									{master.displayName.trim()[0]?.toUpperCase() ?? '?'}
								</Avatar.Fallback>
							</Avatar>

							<View className='flex-1 gap-2'>
								<Text className='text-2xl font-bold text-foreground'>
									{master.displayName}
								</Text>

								<View className='flex-row items-center gap-1'>
									<Ionicons name='star' size={18} color={mutedColor} />
									<Text className='text-base font-semibold text-foreground'>
										{master.rating}
									</Text>
								</View>

								{master.description ? (
									<Text className='text-base text-muted'>
										{master.description}
									</Text>
								) : null}
							</View>
						</View>
					</Card.Body>
				</Card>

				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>
							{t('servicesTitle')}
						</Text>
					</Card.Header>
					<Card.Body className='mt-2 gap-3 p-0'>
						{services.length === 0 ? (
							<Text className='text-base text-muted'>{t('noServices')}</Text>
						) : (
							services.map((service) => (
								<MasterServiceItem
									key={service.id}
									onPress={() => router.push(`/master-service/${service.id}`)}
									service={service}
								/>
							))
						)}
					</Card.Body>
				</Card>
			</View>
		</BasePage>
	)
}

interface IMasterServiceItemProps {
	service: IMasterProfileService
	onPress: () => void
}

function MasterServiceItem({
	service,
	onPress,
}: IMasterServiceItemProps): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<Pressable
			accessibilityRole='button'
			className='rounded-2xl border border-border bg-surface p-4 active:opacity-80'
			onPress={onPress}
		>
			<View className='gap-2'>
				<View className='flex-row items-start justify-between gap-3'>
					<Text className='flex-1 text-base font-semibold text-foreground'>
						{service.name}
					</Text>

					{service.price != null ? (
						<Chip color='accent' variant='soft'>
							{formatPriceByCurrency(service.price, ECurrency.RUB)}
						</Chip>
					) : null}
				</View>

				{service.description ? (
					<Text className='text-sm text-muted' numberOfLines={3}>
						{service.description}
					</Text>
				) : null}

				{service.durationMinutes != null ? (
					<View className='flex-row items-center gap-1.5'>
						<Ionicons name='time-outline' size={16} color={mutedColor} />
						<Text className='text-sm text-muted'>
							{tUi('durationMinutes', { count: service.durationMinutes })}
						</Text>
					</View>
				) : null}
			</View>
		</Pressable>
	)
}
