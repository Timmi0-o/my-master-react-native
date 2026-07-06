import { Card, Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IBasePageLoaderListBodyProps {
	itemCount: number
}

function ListCardSkeleton(): ReactElement {
	return (
		<Card>
			<Card.Body className='gap-3'>
				<Skeleton className='h-5 rounded-full' style={{ width: '62%' }} />
				<Skeleton className='h-6 w-24 rounded-full' />
				<Skeleton className='h-4 w-full rounded-full' />
				<Skeleton className='h-4 rounded-full' style={{ width: '78%' }} />
				<View className='flex-row gap-2 pt-1'>
					<Skeleton className='h-9 flex-1 rounded-xl' />
					<Skeleton className='h-9 flex-1 rounded-xl' />
				</View>
			</Card.Body>
		</Card>
	)
}

export function BasePageLoaderListBody({
	itemCount,
}: IBasePageLoaderListBodyProps): ReactElement {
	return (
		<View className='w-full' style={{ rowGap: 12 }}>
			{Array.from({ length: itemCount }).map((_, index) => (
				<ListCardSkeleton key={index} />
			))}
		</View>
	)
}
