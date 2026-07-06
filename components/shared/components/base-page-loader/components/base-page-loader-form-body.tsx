import { Card, Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IBasePageLoaderFormBodyProps {
	fieldCount: number
}

export function BasePageLoaderFormBody({
	fieldCount,
}: IBasePageLoaderFormBodyProps): ReactElement {
	return (
		<View className='w-full'>
			<View className='mb-4 flex-row gap-2'>
				<Skeleton className='h-10 flex-1 rounded-full' />
				<Skeleton className='h-10 flex-1 rounded-full' />
			</View>

			<Card>
				<Card.Body className='gap-4'>
					{Array.from({ length: fieldCount }).map((_, index) => (
						<View key={index} className='gap-2'>
							<Skeleton className='h-4 w-24 rounded-full' />
							<Skeleton className='h-12 w-full rounded-xl' />
						</View>
					))}

					<Skeleton className='mt-2 h-12 w-full rounded-xl' />
				</Card.Body>
			</Card>
		</View>
	)
}
