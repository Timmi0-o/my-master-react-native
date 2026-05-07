import { BasePage } from '@/components/ui/base-page'
import { Skeleton } from 'heroui-native'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

const CHAT_SKELETON_COUNT = 16

export const ChatsPage = () => {
	return (
		<BasePage>
			<ScrollView
				className='flex-1'
				contentContainerClassName='gap-3 py-5'
				showsVerticalScrollIndicator={false}
			>
				<View className='mb-2'>
					<Text className='text-2xl ml-2 font-bold text-foreground'>Чаты</Text>
				</View>

				{Array.from({ length: CHAT_SKELETON_COUNT }).map((_, index) => (
					<ChatSkeletonItem key={index} />
				))}
			</ScrollView>
		</BasePage>
	)
}

function ChatSkeletonItem() {
	return (
		<View className='flex-row items-center gap-3 rounded-2xl bg-surface py-3 px-2'>
			<Skeleton className='h-12 w-12 rounded-full' />

			<View className='flex-1 gap-2'>
				<View className='flex-row items-center justify-between gap-4'>
					<Skeleton className='h-4 w-32 rounded-full' />
					<Skeleton className='h-3 w-10 rounded-full' />
				</View>

				<Skeleton className='h-4 w-full rounded-full' />
				<Skeleton className='h-4 w-2/3 rounded-full' />
			</View>
		</View>
	)
}
