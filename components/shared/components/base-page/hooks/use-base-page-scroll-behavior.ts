import {
	getPullRefreshProgress,
	PULL_REFRESH_THRESHOLD,
} from '@/components/shared/components/pull-refresh-progress-ring'
import * as Haptics from 'expo-haptics'
import { useCallback, useEffect, useRef } from 'react'
import {
	Extrapolation,
	interpolate,
	runOnJS,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	type AnimatedStyle,
} from 'react-native-reanimated'
import type { ViewStyle } from 'react-native'
import { BASE_PAGE_EDGE_FADE_DISTANCE, BASE_PAGE_PULL_REFRESH_RESET_RATIO } from '../constants/base-page.constants'

interface IUseBasePageScrollBehaviorParams {
	hasRefresh: boolean
	refreshing: boolean
	onRefresh?: () => void
	trackScroll: boolean
}

interface IUseBasePageScrollBehaviorResult {
	handleScroll: ReturnType<typeof useAnimatedScrollHandler> | undefined
	pullOffset: ReturnType<typeof useSharedValue<number>>
	topEdgeAnimatedStyle: AnimatedStyle<ViewStyle>
	bottomEdgeAnimatedStyle: AnimatedStyle<ViewStyle>
	refreshIndicatorAnimatedStyle: AnimatedStyle<ViewStyle>
}

export function useBasePageScrollBehavior({
	hasRefresh,
	refreshing,
	onRefresh,
	trackScroll,
}: IUseBasePageScrollBehaviorParams): IUseBasePageScrollBehaviorResult {
	const scrollY = useSharedValue(0)
	const pullOffset = useSharedValue(0)
	const pullRefreshTriggered = useSharedValue(false)
	const isRefreshingShared = useSharedValue(refreshing)

	useEffect(() => {
		isRefreshingShared.value = refreshing
	}, [isRefreshingShared, refreshing])

	const onRefreshRef = useRef(onRefresh)
	onRefreshRef.current = onRefresh

	const refreshingRef = useRef(refreshing)
	refreshingRef.current = refreshing

	const triggerRefresh = useCallback(() => {
		if (refreshingRef.current) return

		refreshingRef.current = true
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
		onRefreshRef.current?.()
	}, [])

	const handleScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y

			if (!hasRefresh) return

			const nextPullOffset = Math.max(0, -event.contentOffset.y)
			pullOffset.value = nextPullOffset

			if (
				nextPullOffset <
				PULL_REFRESH_THRESHOLD * BASE_PAGE_PULL_REFRESH_RESET_RATIO
			) {
				pullRefreshTriggered.value = false
				return
			}

			if (
				nextPullOffset < PULL_REFRESH_THRESHOLD ||
				pullRefreshTriggered.value ||
				isRefreshingShared.value
			) {
				return
			}

			pullRefreshTriggered.value = true
			isRefreshingShared.value = true
			runOnJS(triggerRefresh)()
		},
	})

	const topEdgeAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, BASE_PAGE_EDGE_FADE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}))

	const bottomEdgeAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollY.value,
			[0, BASE_PAGE_EDGE_FADE_DISTANCE],
			[0, 1],
			Extrapolation.CLAMP,
		),
	}))

	const refreshIndicatorAnimatedStyle = useAnimatedStyle(() => {
		const progress = getPullRefreshProgress(pullOffset.value)
		const isActive = isRefreshingShared.value || progress > 0.05

		return {
			opacity: isActive ? (isRefreshingShared.value ? 1 : progress) : 0,
			transform: [
				{
					translateY: isRefreshingShared.value
						? 0
						: interpolate(progress, [0, 1], [-18, 0], Extrapolation.CLAMP),
				},
				{
					scale: isRefreshingShared.value
						? 1
						: interpolate(progress, [0, 1], [0.6, 1], Extrapolation.CLAMP),
				},
			],
		}
	})

	return {
		handleScroll: trackScroll ? handleScroll : undefined,
		pullOffset,
		topEdgeAnimatedStyle,
		bottomEdgeAnimatedStyle,
		refreshIndicatorAnimatedStyle,
	}
}
