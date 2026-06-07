import { Skeleton } from 'heroui-native'
import { ReactElement } from 'react'
import { View } from 'react-native'

interface IChatSkeletonItemProps {
	isLast?: boolean
}

export const ChatSkeletonItem = ({
	isLast = false,
}: IChatSkeletonItemProps): ReactElement => {
	return (
		<View
			className={`flex-row items-center gap-3 px-4 py-3 ${
				isLast ? '' : 'border-b border-border'
			}`}
		>
			<Skeleton className='h-14 w-14 rounded-full' />

			<View className='flex-1 gap-2'>
				<View className='flex-row items-start justify-between gap-4'>
					<Skeleton className='h-4 w-32 rounded-full' />
					<View className='items-end gap-1'>
						<Skeleton className='h-3 w-10 rounded-full' />
						<Skeleton className='h-5 w-16 rounded-full' />
					</View>
				</View>

				<Skeleton className='h-4 w-full rounded-full' />
			</View>
		</View>
	)
}
