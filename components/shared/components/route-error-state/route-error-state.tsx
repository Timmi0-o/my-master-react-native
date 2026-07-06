import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import type { ReactElement } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface IRouteErrorStateProps {
	message: string
	withBackButton?: boolean
}

export function RouteErrorState({
	message,
	withBackButton = false,
}: IRouteErrorStateProps): ReactElement {
	const insets = useSafeAreaInsets()

	if (withBackButton) {
		return (
			<View
				className='flex-1 bg-background px-4'
				style={{ paddingTop: insets.top + 8 }}
			>
				<BackButton />
				<View className='flex-1'>
					<DataNotFound message={message} />
				</View>
			</View>
		)
	}

	return (
		<View className='flex-1 bg-background' style={{ paddingTop: insets.top }}>
			<DataNotFound message={message} />
		</View>
	)
}
