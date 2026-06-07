import { BackButton } from '@/components/shared/ui/back-button/back-button'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Text, View, type LayoutChangeEvent } from 'react-native'

interface IScheduleScreenHeaderProps {
	title: string
	extraContent?: ReactElement
}

const TITLE_FONT_SIZE = 20
const TITLE_MIN_FONT_SCALE = 0.72
const TITLE_SIDE_GAP = 8
const MIN_SIDE_SLOT_WIDTH = 44

export function ScheduleScreenHeader({
	title,
	extraContent,
}: IScheduleScreenHeaderProps): ReactElement {
	const [leftWidth, setLeftWidth] = useState(0)
	const [rightWidth, setRightWidth] = useState(0)

	useEffect(() => {
		setLeftWidth(0)
		setRightWidth(0)
	}, [extraContent, title])

	const handleLeftLayout = useCallback((event: LayoutChangeEvent) => {
		setLeftWidth(event.nativeEvent.layout.width)
	}, [])

	const handleRightLayout = useCallback((event: LayoutChangeEvent) => {
		setRightWidth(event.nativeEvent.layout.width)
	}, [])

	const sideSlotWidth =
		Math.max(leftWidth, rightWidth, MIN_SIDE_SLOT_WIDTH) + TITLE_SIDE_GAP

	return (
		<View className='mb-4 flex-row items-center px-2' style={{ minHeight: 44 }}>
			<View style={{ alignItems: 'flex-start', width: sideSlotWidth }}>
				<View onLayout={handleLeftLayout}>
					<BackButton />
				</View>
			</View>

			<View style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}>
				<Text
					adjustsFontSizeToFit
					className='text-center font-bold text-foreground'
					minimumFontScale={TITLE_MIN_FONT_SCALE}
					numberOfLines={1}
					style={{ fontSize: TITLE_FONT_SIZE, width: '100%' }}
				>
					{title}
				</Text>
			</View>

			<View style={{ alignItems: 'flex-end', width: sideSlotWidth }}>
				<View onLayout={handleRightLayout}>{extraContent ?? null}</View>
			</View>
		</View>
	)
}
