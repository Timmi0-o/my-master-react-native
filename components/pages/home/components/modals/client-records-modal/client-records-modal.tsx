import { IRecord } from '@/actions/record/models/record.schema'
import { RecordCard } from '@/components/shared/record-card/record-card'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheet } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

interface IClientRecordsModalProps {
	isVisible: boolean
	records: IRecord[]
	onClose: () => void
}

export function ClientRecordsModal({
	isVisible,
	records,
	onClose,
}: IClientRecordsModalProps): ReactElement {
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
					<BottomSheet.Title>Все записи</BottomSheet.Title>
					<BottomSheet.Description>
						Всего записей: {records.length}
					</BottomSheet.Description>

					<BottomSheetScrollView
						contentContainerClassName='gap-3 pb-4'
						showsVerticalScrollIndicator={false}
					>
						{records.length === 0 ? (
							<Text className='text-base text-muted'>Записей пока нет</Text>
						) : (
							records.map((record) => (
								<RecordCard
									key={record.id}
									onBeforeNavigate={onClose}
									record={record}
								/>
							))
						)}
					</BottomSheetScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	)
}
