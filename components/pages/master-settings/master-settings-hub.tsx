import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterSettingsHubProps {
	masterProfile: IMasterProfile
}

export function MasterSettingsHub({
	masterProfile,
}: IMasterSettingsHubProps): ReactElement {
	const router = useRouter()
	const { t, i18n } = useScopedTranslation('pages', 'masterSettings')
	const bookingStatusLabel = useEnumLabel('enums.bookingStatus')
	const bookingStatus = masterProfile.bookingStatus ?? 'ACCEPTING'
	const statusLabel = bookingStatusLabel(bookingStatus)
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	return (
		<BasePage>
			<ScheduleScreenHeader title={t('hubTitle')} />

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Body className='gap-2'>
						<Text className='text-muted'>{t('currentStatus')}</Text>
						<Chip color='accent'>{statusLabel}</Chip>
						{masterProfile.pausedUntil ? (
							<Text className='text-sm text-muted'>
								{t('pausedUntil', {
									date: new Date(masterProfile.pausedUntil).toLocaleString(
										dateTimeLocale,
									),
								})}
							</Text>
						) : null}
					</Card.Body>
				</Card>

				<Card>
					<Card.Body className='gap-3 p-0'>
						<Button
							variant='secondary'
							onPress={() => router.push('/master-settings/booking')}
						>
							<Button.Label>{t('bookingRules')}</Button.Label>
						</Button>
						<Button
							variant='secondary'
							onPress={() => router.push('/master-settings/weekly-schedule')}
						>
							<Button.Label>{t('weeklySchedule')}</Button.Label>
						</Button>
						<Button
							variant='secondary'
							onPress={() =>
								router.push('/master-settings/schedule-exceptions')
							}
						>
							<Button.Label>{t('exceptions')}</Button.Label>
						</Button>
					</Card.Body>
				</Card>
			</View>
		</BasePage>
	)
}
