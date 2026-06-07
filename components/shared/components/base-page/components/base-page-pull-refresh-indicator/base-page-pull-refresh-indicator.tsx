import { PullRefreshProgressRing } from '@/components/shared/components/pull-refresh-progress-ring'
import { Spinner, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import Animated, {
	type AnimatedStyle,
	type SharedValue,
} from 'react-native-reanimated'
import type { ViewStyle } from 'react-native'
import { BASE_PAGE_PULL_REFRESH_INDICATOR_HEIGHT } from '../../constants/base-page.constants'

interface IBasePagePullRefreshIndicatorProps {
	animatedStyle: AnimatedStyle<ViewStyle>
	pullOffset: SharedValue<number>
	refreshIndicatorTop: number
	refreshing: boolean
}

export function BasePagePullRefreshIndicator({
	animatedStyle,
	pullOffset,
	refreshIndicatorTop,
	refreshing,
}: IBasePagePullRefreshIndicatorProps): ReactElement {
	const accentColor = useThemeColor('accent')
	const mutedColor = useThemeColor('muted')

	return (
		<Animated.View
			pointerEvents='none'
			style={[
				{
					alignItems: 'center',
					height: refreshIndicatorTop + BASE_PAGE_PULL_REFRESH_INDICATOR_HEIGHT,
					justifyContent: 'flex-end',
					left: 0,
					paddingBottom: 8,
					position: 'absolute',
					right: 0,
					top: 0,
					zIndex: 20,
				},
				animatedStyle,
			]}
		>
			{refreshing ? (
				<Spinner color={accentColor} size='sm' />
			) : (
				<PullRefreshProgressRing
					accentColor={accentColor}
					pullOffset={pullOffset}
					trackColor={mutedColor}
				/>
			)}
		</Animated.View>
	)
}
