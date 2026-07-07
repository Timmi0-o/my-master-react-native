import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { ChatListItem } from '@/components/pages/chats/chats-page/components/chat-list-item/chat-list-item'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ChatSkeletonItem } from './components/skeletons/chat-skeleton-item'

const CHAT_SKELETON_COUNT = 8

interface IChatsPageProps {
	mode: ActiveProfileMode
	chats: IAppointment[]
	isLoading: boolean
	isRefreshing: boolean
	onRefresh: () => void
}

export const ChatsPage = ({
	mode,
	chats,
	isLoading,
	isRefreshing,
	onRefresh,
}: IChatsPageProps): ReactElement => {
	const { t } = useScopedTranslation('pages', 'chats')
	const emptyLabel = mode === 'master' ? t('emptyMaster') : t('emptyClient')

	return (
		<BasePage onRefresh={onRefresh} refreshing={isRefreshing}>
			<View className='gap-3 py-5'>
				<View className='mb-2'>
					<Text className='ml-2 font-bold text-foreground text-2xl'>
						{t('title')}
					</Text>
				</View>

				{isLoading ? (
					<View className='bg-surface rounded-2xl overflow-hidden'>
						{Array.from({ length: CHAT_SKELETON_COUNT }).map((_, index) => (
							<ChatSkeletonItem
								key={index}
								isLast={index === CHAT_SKELETON_COUNT - 1}
							/>
						))}
					</View>
				) : chats.length ? (
					<View className='bg-surface mx-2 rounded-2xl overflow-hidden'>
						{chats.map((appointment, index) => (
							<ChatListItem
								key={appointment.chat?.id ?? appointment.id}
								appointment={appointment}
								isLast={index === chats.length - 1}
								mode={mode}
							/>
						))}
					</View>
				) : (
					<DataNotFound message={emptyLabel} />
				)}
			</View>
		</BasePage>
	)
}
