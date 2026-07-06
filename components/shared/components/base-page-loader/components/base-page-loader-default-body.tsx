import { Card, Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IBasePageLoaderDefaultBodyProps {
	itemCount: number
}

function DefaultCardSkeleton(): ReactElement {
	return (
		<Card>
			<Card.Body className='gap-3'>
				<Skeleton className='h-5 rounded-full' style={{ width: '48%' }} />
				<Skeleton className='h-4 w-full rounded-full' />
				<Skeleton className='h-4 rounded-full' style={{ width: '84%' }} />
				<Skeleton className='h-4 rounded-full' style={{ width: '66%' }} />
			</Card.Body>
		</Card>
	)
}

export function BasePageLoaderDefaultBody({
	itemCount,
}: IBasePageLoaderDefaultBodyProps): ReactElement {
	return (
		<View className='w-full' style={{ rowGap: 12 }}>
			{Array.from({ length: itemCount }).map((_, index) => (
				<DefaultCardSkeleton key={index} />
			))}
		</View>
	)
}
