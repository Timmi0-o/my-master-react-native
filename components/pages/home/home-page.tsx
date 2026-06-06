import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { ClientRecordsModal } from '@/components/pages/home/components/modals/client-records-modal/client-records-modal'
import { HOME_RECORDS_PREVIEW_LIMIT } from '@/components/pages/home/data/home-records.constants'
import { BasePage } from '@/components/shared/components/base-page'
import { RecordCard } from '@/components/shared/components/record-card/record-card'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { Button, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'

interface IHomePageProps {
	mode: ActiveProfileMode
	appointments: IAppointment[]
}

export default function HomePage({
	mode,
	appointments,
}: IHomePageProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'home')

	const { t: tBtn } = useScopedTranslation('ui', 'button')

	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')

	const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false)
	const foregroundColor = useThemeColor('foreground')

	const hasRecords = appointments.length > 0
	const previewRecords = appointments.slice(0, HOME_RECORDS_PREVIEW_LIMIT)

	const shouldShowAllRecordsButton =
		appointments.length > HOME_RECORDS_PREVIEW_LIMIT
	const title = mode === 'master' ? t('titleMaster') : t('titleClient')

	return (
		<BasePage>
			<View className='flex-1 gap-3'>
				<Text className='text-2xl font-bold text-foreground ml-2'>{title}</Text>

				<GlassInput
					style={{ minHeight: 60 }}
					placeholder={tPlaceholder('searchRecords')}
				/>

				{hasRecords ? (
					<View className='gap-3'>
						{previewRecords.map((appointment) => (
							<RecordCard
								key={appointment.id}
								appointment={appointment}
								mode={mode}
							/>
						))}

						{shouldShowAllRecordsButton && (
							<Button
								className='rounded-2xl'
								onPress={() => setIsRecordsModalVisible(true)}
								variant='outline'
							>
								<Ionicons
									name='albums-outline'
									size={20}
									color={foregroundColor}
								/>
								<Button.Label>{tBtn('viewAll')}</Button.Label>
							</Button>
						)}
					</View>
				) : (
					<Text className='text-base text-muted'>{t('empty')}</Text>
				)}
			</View>

			{shouldShowAllRecordsButton && (
				<ClientRecordsModal
					isVisible={isRecordsModalVisible}
					onClose={() => setIsRecordsModalVisible(false)}
					appointments={appointments}
					mode={mode}
				/>
			)}
		</BasePage>
	)
}
