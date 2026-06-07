import type { ReactElement } from 'react'
import Animated, { type AnimatedStyle } from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import type { ViewStyle } from 'react-native'

type TEdgeFadePlacement = 'top' | 'bottom'

interface IBasePageEdgeFadeProps {
	animatedStyle: AnimatedStyle<ViewStyle>
	backgroundColor: string
	fadeEndOffset: number
	fadeMidOffset: number
	gradientId: string
	height: number
	placement: TEdgeFadePlacement
	safeAreaEndOffset: number
}

export function BasePageEdgeFade({
	animatedStyle,
	backgroundColor,
	fadeEndOffset,
	fadeMidOffset,
	gradientId,
	height,
	placement,
	safeAreaEndOffset,
}: IBasePageEdgeFadeProps): ReactElement {
	const isTop = placement === 'top'

	return (
		<Animated.View
			pointerEvents='none'
			style={[
				{
					height,
					left: 0,
					position: 'absolute',
					right: 0,
					zIndex: 10,
					...(isTop ? { top: 0 } : { bottom: 0 }),
				},
				animatedStyle,
			]}
		>
			<Svg height={height} preserveAspectRatio='none' width='100%'>
				<Defs>
					<LinearGradient
						id={gradientId}
						x1='0'
						x2='0'
						y1={isTop ? '0' : '1'}
						y2={isTop ? '1' : '0'}
					>
						<Stop offset='0' stopColor={backgroundColor} stopOpacity='0.97' />
						<Stop
							offset={String(fadeMidOffset)}
							stopColor={backgroundColor}
							stopOpacity='0.88'
						/>
						<Stop
							offset={String(safeAreaEndOffset)}
							stopColor={backgroundColor}
							stopOpacity='0.72'
						/>
						<Stop
							offset={String(fadeEndOffset)}
							stopColor={backgroundColor}
							stopOpacity='0.24'
						/>
						<Stop offset='1' stopColor={backgroundColor} stopOpacity='0' />
					</LinearGradient>
				</Defs>
				<Rect fill={`url(#${gradientId})`} height='100%' width='100%' />
			</Svg>
		</Animated.View>
	)
}
