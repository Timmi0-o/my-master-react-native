import { BackButton } from '@/components/shared/ui/back-button/back-button'
import type { ReactElement, ReactNode } from 'react'
import { Text, View } from 'react-native'

interface IBasePageHeaderProps {
	title: string
	titleContent?: ReactNode
	rightContent?: ReactNode
	leftContent?: ReactNode
}

const DEFAULT_LEFT_CONTENT = <BackButton withoutLabel />

const TITLE_FONT_SIZE = 20
const TITLE_MIN_FONT_SCALE = 0.72

export function BasePageHeader({
	title,
	titleContent,
	rightContent,
	leftContent,
}: IBasePageHeaderProps): ReactElement {
	const resolvedLeftContent = leftContent ?? DEFAULT_LEFT_CONTENT

	return (
		<View className='mb-4 flex-row items-center px-2' style={{ minHeight: 44 }}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				{resolvedLeftContent}
			</View>

			<View
				style={{
					flex: 2,
					minHeight: 44,
					justifyContent: 'center',
					paddingHorizontal: 4,
				}}
			>
				{titleContent ?? (
					<Text
						adjustsFontSizeToFit
						className='text-center font-bold text-foreground'
						minimumFontScale={TITLE_MIN_FONT_SCALE}
						numberOfLines={1}
						style={{ fontSize: TITLE_FONT_SIZE, width: '100%' }}
					>
						{title}
					</Text>
				)}
			</View>

			<View style={{ flex: 1, alignItems: 'flex-end' }}>{rightContent}</View>
		</View>
	)
}
