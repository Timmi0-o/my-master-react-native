import { Card, Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

function HubTileSkeleton({
	variant,
}: {
	variant: 'compact' | 'wide'
}): ReactElement {
	const isWide = variant === 'wide'

	return (
		<Card
			style={{
				minHeight: isWide ? 92 : 132,
				flex: isWide ? 1 : 0.48,
			}}
		>
			<Card.Body className={isWide ? 'gap-0' : 'gap-3'}>
				{isWide ? (
					<View className='flex-row items-center gap-3'>
						<Skeleton className='h-12 w-12 rounded-2xl' />
						<Skeleton className='h-4 flex-1 rounded-full' />
						<Skeleton className='h-4 w-4 rounded-full' />
					</View>
				) : (
					<>
						<View className='flex-row items-start justify-between'>
							<Skeleton className='h-12 w-12 rounded-2xl' />
							<Skeleton className='h-4 w-4 rounded-full' />
						</View>
						<Skeleton className='h-4 w-24 rounded-full' />
					</>
				)}
			</Card.Body>
		</Card>
	)
}

export function BasePageLoaderHubBody(): ReactElement {
	return (
		<View className='w-full' style={{ rowGap: 16 }}>
			<Card>
				<Card.Body className='gap-3'>
					<Skeleton className='h-3 w-28 rounded-full' />
					<Skeleton className='h-8 w-36 rounded-full' />
				</Card.Body>
			</Card>

			<View className='flex-row flex-wrap justify-between gap-3'>
				<HubTileSkeleton variant='compact' />
				<HubTileSkeleton variant='compact' />
				<HubTileSkeleton variant='compact' />
				<HubTileSkeleton variant='wide' />
			</View>
		</View>
	)
}
