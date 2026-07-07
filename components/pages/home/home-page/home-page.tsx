import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { RecordCardList } from '@/components/shared/components/record-card/record-card-list'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Button, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { ClientRecordsModal } from './components/modals/client-records-modal/client-records-modal'
import { HOME_RECORDS_PREVIEW_LIMIT } from './data/home-records.constants'

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
	const shouldShowAllRecordsButton =
		appointments.length > HOME_RECORDS_PREVIEW_LIMIT
	const title = mode === 'master' ? t('titleMaster') : t('titleClient')

	return (
		<BasePage>
			<View className='flex-1 gap-3'>
				<Text className='ml-2 font-bold text-foreground text-2xl'>{title}</Text>

				<GlassInput
					style={{ minHeight: 60, marginHorizontal: 4 }}
					placeholder={tPlaceholder('searchRecords')}
				/>

				{hasRecords ? (
					<View className='gap-3'>
						<RecordCardList
							appointments={appointments}
							limit={HOME_RECORDS_PREVIEW_LIMIT}
							mode={mode}
						/>

						{shouldShowAllRecordsButton && (
							<Button
								className='rounded-2xl'
								onPress={() => setIsRecordsModalVisible(true)}
								variant='ghost'
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
					<DataNotFound message={t('empty')} />
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
