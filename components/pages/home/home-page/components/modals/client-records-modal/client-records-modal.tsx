import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { RecordCardList } from '@/components/shared/components/record-card/record-card-list'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheet } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

interface IClientRecordsModalProps {
	isVisible: boolean
	appointments: IAppointment[]
	mode: ActiveProfileMode
	onClose: () => void
}

export function ClientRecordsModal({
	isVisible,
	appointments,
	mode,
	onClose,
}: IClientRecordsModalProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'home')

	const handleOpenChange = (value: boolean) => {
		if (!value) {
			onClose()
		}
	}

	return (
		<BottomSheet isOpen={isVisible} onOpenChange={handleOpenChange}>
			<BottomSheet.Portal>
				<BottomSheet.Overlay />
				<BottomSheet.Content
					contentContainerClassName='h-full px-4'
					enableDynamicSizing={false}
					enableOverDrag={false}
					snapPoints={['60%', '85%']}
				>
					<BottomSheet.Title>{t('allRecordsTitle')}</BottomSheet.Title>
					<BottomSheet.Description>
						{t('allRecordsCount', { count: appointments.length })}
					</BottomSheet.Description>

					<BottomSheetScrollView
						contentContainerClassName='gap-3 pb-4'
						showsVerticalScrollIndicator={false}
					>
						{appointments.length === 0 ? (
							<DataNotFound compact message={t('empty')} />
						) : (
							<RecordCardList
								appointments={appointments}
								mode={mode}
								onBeforeNavigate={onClose}
							/>
						)}
					</BottomSheetScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	)
}
