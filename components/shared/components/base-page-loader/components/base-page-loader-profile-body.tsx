import { Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

export function BasePageLoaderProfileBody(): ReactElement {
	return (
		<View className='w-full items-center gap-3'>
			<Skeleton className='h-8 rounded-full' style={{ width: '58%' }} />
			<Skeleton className='h-10 w-40 rounded-full' />
			<Skeleton className='h-4 rounded-full' style={{ width: '88%' }} />
			<Skeleton className='h-4 rounded-full' style={{ width: '70%' }} />
		</View>
	)
}
