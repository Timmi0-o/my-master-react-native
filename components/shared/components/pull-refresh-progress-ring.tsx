import type { ReactElement } from 'react'
import Animated, {
	type SharedValue,
	useAnimatedProps,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const RING_SIZE = 24
const RING_STROKE = 2.5
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
const RING_CENTER = RING_SIZE / 2

export const PULL_REFRESH_THRESHOLD = 150
export const PULL_REFRESH_PROGRESS_EASING = 1.35

export function getPullRefreshProgress(pullOffset: number): number {
	'worklet'

	const rawProgress = Math.min(pullOffset / PULL_REFRESH_THRESHOLD, 1)

	return Math.pow(rawProgress, PULL_REFRESH_PROGRESS_EASING)
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface IPullRefreshProgressRingProps {
	pullOffset: SharedValue<number>
	accentColor: string
	trackColor: string
}

export function PullRefreshProgressRing({
	pullOffset,
	accentColor,
	trackColor,
}: IPullRefreshProgressRingProps): ReactElement {
	const progressCircleProps = useAnimatedProps(() => {
		const progress = getPullRefreshProgress(pullOffset.value)

		return {
			strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress),
		}
	})

	return (
		<Svg height={RING_SIZE} width={RING_SIZE}>
			<Circle
				cx={RING_CENTER}
				cy={RING_CENTER}
				fill='none'
				r={RING_RADIUS}
				stroke={trackColor}
				strokeWidth={RING_STROKE}
			/>
			<AnimatedCircle
				animatedProps={progressCircleProps}
				cx={RING_CENTER}
				cy={RING_CENTER}
				fill='none'
				origin={`${RING_CENTER}, ${RING_CENTER}`}
				r={RING_RADIUS}
				rotation='-90'
				stroke={accentColor}
				strokeDasharray={RING_CIRCUMFERENCE}
				strokeLinecap='round'
				strokeWidth={RING_STROKE}
			/>
		</Svg>
	)
}
