import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import type { Href } from 'expo-router'
import { useRouter } from 'expo-router'
import { Card, Chip, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterSettingsHubProps {
	masterProfile: IMasterProfile
}

interface ISettingsTile {
	key: string
	label: string
	href: Href
	icon: keyof typeof Ionicons.glyphMap
}

interface ISettingsTileBlockProps {
	tile: ISettingsTile
	variant: 'compact' | 'wide'
	mutedColor: string
	onPress: () => void
}

function SettingsTileBlock({
	tile,
	variant,
	mutedColor,
	onPress,
}: ISettingsTileBlockProps): ReactElement {
	const isWide = variant === 'wide'

	return (
		<Pressable
			accessibilityRole='button'
			onPress={onPress}
			style={{
				minHeight: isWide ? 92 : 132,
				width: isWide ? '100%' : '48%',
			}}
			className={`rounded-2xl border border-border bg-background-secondary active:opacity-80 ${
				isWide
					? 'flex-row items-center gap-3 px-4 py-4'
					: 'flex-col justify-between p-4'
			}`}
		>
			{isWide ? (
				<>
					<View className='rounded-2xl bg-surface p-3'>
						<Ionicons name={tile.icon} size={22} color={mutedColor} />
					</View>
					<Text className='flex-1 text-base font-semibold text-foreground'>
						{tile.label}
					</Text>
					<Ionicons name='chevron-forward' size={20} color={mutedColor} />
				</>
			) : (
				<>
					<View className='mb-2 flex-row items-start justify-between'>
						<View className='rounded-2xl bg-surface p-3'>
							<Ionicons name={tile.icon} size={26} color={mutedColor} />
						</View>
						<Ionicons name='chevron-forward' size={18} color={mutedColor} />
					</View>
					<Text className='text-sm font-semibold text-foreground'>
						{tile.label}
					</Text>
				</>
			)}
		</Pressable>
	)
}

export function MasterSettingsHub({
	masterProfile,
}: IMasterSettingsHubProps): ReactElement {
	const router = useRouter()
	const { t, i18n } = useScopedTranslation('pages', 'masterSettings')
	const bookingStatusLabel = useEnumLabel('enums.bookingStatus')
	const mutedColor = useThemeColor('muted')
	const bookingStatus = masterProfile.bookingStatus ?? 'ACCEPTING'
	const statusLabel = bookingStatusLabel(bookingStatus)
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	const tiles: ISettingsTile[] = [
		{
			key: 'booking',
			label: t('bookingRules'),
			href: '/master-settings/booking',
			icon: 'reader-outline',
		},
		{
			key: 'weekly',
			label: t('weeklySchedule'),
			href: '/master-settings/weekly-schedule',
			icon: 'calendar-outline',
		},
		{
			key: 'exceptions',
			label: t('exceptions'),
			href: '/master-settings/schedule-exceptions',
			icon: 'today-outline',
		},
	]

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

				<View className='flex-row flex-wrap justify-between gap-3'>
					{tiles.map((tile, index) => (
						<SettingsTileBlock
							key={tile.key}
							tile={tile}
							variant={index === 2 ? 'wide' : 'compact'}
							mutedColor={mutedColor}
							onPress={() => router.push(tile.href)}
						/>
					))}
				</View>
			</View>
		</BasePage>
	)
}
