import { IRecord } from '@/actions/record/models/record.schema'
import { ClientRecordsModal } from '@/components/pages/home/components/modals/client-records-modal/client-records-modal'
import { HOME_RECORDS_PREVIEW_LIMIT } from '@/components/pages/home/data/home-records.constants'
import { RecordCard } from '@/components/shared/record-card/record-card'
import { BasePage } from '@/components/shared/ui/base-page'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { Ionicons } from '@expo/vector-icons'
import { Button, Card, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { ScrollView, Text, View, type ViewStyle } from 'react-native'

const CLIENT_RECORD_PREVIEW_STYLE: ViewStyle = { width: 280 }
const VIEW_ALL_BUTTON_STYLE: ViewStyle = { minHeight: 132, width: 160 }

interface IHomePageProps {
	mode: ActiveProfileMode
	records: IRecord[]
}

export default function HomePage({ mode, records }: IHomePageProps): ReactElement {
	const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false)
	const foregroundColor = useThemeColor('foreground')

	const hasRecords = records.length > 0
	const previewRecords = records.slice(0, HOME_RECORDS_PREVIEW_LIMIT)
	const shouldShowAllRecordsButton = records.length > HOME_RECORDS_PREVIEW_LIMIT
	const title =
		mode === 'master' ? 'Записи моих клиентов' : 'Мои записи'

	return (
		<BasePage>
			<View className='flex-1 gap-3'>
				<Card>
					<Card.Header>
						<Text className='text-2xl font-bold text-foreground ml-2'>
							{title}
						</Text>
					</Card.Header>
					<Card.Body className='mt-4 p-0'>
						{hasRecords ? (
							<ScrollView
								horizontal
								contentContainerClassName='gap-3 pr-2'
								showsHorizontalScrollIndicator={false}
							>
								{previewRecords.map((record) => (
									<RecordCard
										key={record.id}
										record={record}
										style={CLIENT_RECORD_PREVIEW_STYLE}
									/>
								))}

								{shouldShowAllRecordsButton && (
									<Button
										className='rounded-2xl h-full'
										onPress={() => setIsRecordsModalVisible(true)}
										style={VIEW_ALL_BUTTON_STYLE}
										variant='outline'
									>
										<Ionicons
											name='albums-outline'
											size={20}
											color={foregroundColor}
										/>
										<Button.Label>Посмотреть все</Button.Label>
									</Button>
								)}
							</ScrollView>
						) : (
							<Text className='text-base text-muted'>Записей пока нет</Text>
						)}
					</Card.Body>
				</Card>
			</View>

			{shouldShowAllRecordsButton && (
				<ClientRecordsModal
					isVisible={isRecordsModalVisible}
					onClose={() => setIsRecordsModalVisible(false)}
					records={records}
				/>
			)}
		</BasePage>
	)
}
