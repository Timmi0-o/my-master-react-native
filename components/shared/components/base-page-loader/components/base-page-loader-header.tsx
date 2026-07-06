import { Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IBasePageLoaderHeaderProps {
	showRightAction?: boolean
}

export function BasePageLoaderHeader({
	showRightAction = false,
}: IBasePageLoaderHeaderProps): ReactElement {
	return (
		<View className='mb-4 flex-row items-center px-2' style={{ minHeight: 44 }}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				<Skeleton className='h-11 w-11 rounded-full' />
			</View>

			<View
				style={{
					flex: 2,
					alignItems: 'center',
					justifyContent: 'center',
					paddingHorizontal: 4,
				}}
			>
				<Skeleton className='h-5 rounded-full' style={{ flex: 1 }} />
			</View>

			<View style={{ flex: 1, alignItems: 'flex-end' }}>
				{showRightAction ? (
					<Skeleton className='h-9 w-9 rounded-full' />
				) : (
					<View style={{ width: 36, height: 36 }} />
				)}
			</View>
		</View>
	)
}
