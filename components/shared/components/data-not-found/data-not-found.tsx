import { DataNotFoundIllustration } from '@/components/shared/components/data-not-found/data-not-found-illustration'
import type { ReactElement } from 'react'
import { Text, View, type StyleProp, type ViewStyle } from 'react-native'

interface IDataNotFoundProps {
	compact?: boolean
	message: string
	style?: StyleProp<ViewStyle>
}

export function DataNotFound({
	compact = false,
	message,
	style,
}: IDataNotFoundProps): ReactElement {
	return (
		<View
			className={
				compact
					? 'items-center px-4 py-6'
					: 'flex-1 items-center justify-center px-6 py-10'
			}
			style={style}
		>
			<DataNotFoundIllustration compact={compact} />

			<Text
				className={`text-center text-base text-muted ${compact ? 'mt-4' : 'mt-6'}`}
				style={{ maxWidth: 280 }}
			>
				{message}
			</Text>
		</View>
	)
}
