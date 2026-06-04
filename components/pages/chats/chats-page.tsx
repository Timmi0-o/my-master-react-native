import { ChatListItem } from '@/components/shared/chat-list-item/chat-list-item'
import { BasePage } from '@/components/shared/ui/base-page'
import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const CHAT_SKELETON_COUNT = 8

interface IChatsPageProps {
	mode: ActiveProfileMode
	chats: IAppointment[]
	isLoading: boolean
}

export const ChatsPage = ({
	mode,
	chats,
	isLoading,
}: IChatsPageProps): ReactElement => {
	const { t } = useScopedTranslation('pages', 'chats')
	const emptyLabel =
		mode === 'master' ? t('emptyMaster') : t('emptyClient')

	return (
		<BasePage>
			<ScrollView
				className='flex-1'
				contentContainerClassName='gap-3 py-5'
				showsVerticalScrollIndicator={false}
			>
				<View className='mb-2'>
					<Text className='ml-2 text-2xl font-bold text-foreground'>
						{t('title')}
					</Text>
				</View>

				{isLoading ? (
					Array.from({ length: CHAT_SKELETON_COUNT }).map((_, index) => (
						<ChatSkeletonItem key={index} />
					))
				) : chats.length > 0 ? (
					chats.map((appointment) => (
						<ChatListItem
							key={appointment.chat?.id ?? appointment.id}
							appointment={appointment}
							mode={mode}
						/>
					))
				) : (
					<Text className='ml-2 text-base text-muted'>{emptyLabel}</Text>
				)}
			</ScrollView>
		</BasePage>
	)
}

function ChatSkeletonItem() {
	return (
		<View className='flex-row items-center gap-3 rounded-2xl bg-surface px-3 py-3'>
			<Skeleton className='h-12 w-12 rounded-full' />

			<View className='flex-1 gap-2'>
				<View className='flex-row items-center justify-between gap-4'>
					<Skeleton className='h-4 w-32 rounded-full' />
					<Skeleton className='h-3 w-10 rounded-full' />
				</View>

				<Skeleton className='h-3 w-24 rounded-full' />
				<Skeleton className='h-4 w-full rounded-full' />
			</View>
		</View>
	)
}
