import MaskedView from '@react-native-masked-view/masked-view'
import { BlurView } from 'expo-blur'
import type { ReactElement } from 'react'
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native'
import Animated, { type AnimatedStyle } from 'react-native-reanimated'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { BASE_PAGE_OVERLAY_BLUR_INTENSITY } from '../../constants/base-page.constants'
import {
	buildOverlayBlurMaskStopsWithChromePlateau,
	buildOverlayOpacityStopsWithChromePlateau,
	type IOverlayOpacityStop,
} from '../../helpers/build-overlay-opacity-stops'
import { isOverlayBlurAvailable } from '../../helpers/is-overlay-blur-available'

type TEdgeFadePlacement = 'top' | 'bottom'
type TEdgeFadeKind = 'scroll' | 'overlay'

interface IBasePageEdgeFadeProps {
	animatedStyle?: AnimatedStyle<ViewStyle>
	backgroundColor: string
	chromeZoneRatio?: number
	edgeInset?: number
	fadeKind?: TEdgeFadeKind
	gradientId: string
	height: number
	placement: TEdgeFadePlacement
	scrollFadeStops?: IOverlayOpacityStop[]
}

function renderTintStops(
	stops: IOverlayOpacityStop[],
	backgroundColor: string,
): ReactElement[] {
	return stops.map((stop) => (
		<Stop
			key={`tint-${stop.offset}`}
			offset={String(stop.offset)}
			stopColor={backgroundColor}
			stopOpacity={String(stop.opacity)}
		/>
	))
}

function renderBlurMaskStops(stops: IOverlayOpacityStop[]): ReactElement[] {
	return stops.map((stop) => (
		<Stop
			key={`blur-mask-${stop.offset}`}
			offset={String(stop.offset)}
			stopColor='white'
			stopOpacity={String(stop.opacity)}
		/>
	))
}

function renderOverlayBlurMask({
	gradientId,
	isTop,
	stops,
}: {
	gradientId: string
	isTop: boolean
	stops: IOverlayOpacityStop[]
}): ReactElement {
	return (
		<View style={styles.blurMaskRoot}>
			<Svg height='100%' preserveAspectRatio='none' width='100%'>
				<Defs>
					<LinearGradient
						id={`${gradientId}BlurMask`}
						x1='0'
						x2='0'
						y1={isTop ? '0' : '1'}
						y2={isTop ? '1' : '0'}
					>
						{renderBlurMaskStops(stops)}
					</LinearGradient>
				</Defs>
				<Rect fill={`url(#${gradientId}BlurMask)`} height='100%' width='100%' />
			</Svg>
		</View>
	)
}

export function BasePageEdgeFade({
	animatedStyle,
	backgroundColor,
	chromeZoneRatio = 0,
	edgeInset = 0,
	fadeKind = 'scroll',
	gradientId,
	height,
	placement,
	scrollFadeStops = [],
}: IBasePageEdgeFadeProps): ReactElement {
	const isTop = placement === 'top'
	const isOverlay = fadeKind === 'overlay'
	const stopAnchor = isTop ? 'start' : 'end'
	const overlayTintStops = buildOverlayOpacityStopsWithChromePlateau(
		chromeZoneRatio,
		stopAnchor,
	)
	const overlayBlurMaskStops = buildOverlayBlurMaskStopsWithChromePlateau(
		chromeZoneRatio,
		stopAnchor,
	)
	const showOverlayBlur = isOverlay && isOverlayBlurAvailable()

	return (
		<Animated.View
			pointerEvents='none'
			style={[
				{
					height,
					left: 0,
					overflow: 'hidden',
					position: 'absolute',
					right: 0,
					zIndex: 10,
					...(Platform.OS === 'android' ? { elevation: 10 } : null),
					...(isTop ? { top: edgeInset } : { bottom: -8 }),
				},
				isOverlay ? { opacity: 1 } : animatedStyle,
			]}
		>
			{showOverlayBlur ? (
				<MaskedView
					maskElement={renderOverlayBlurMask({
						gradientId,
						isTop,
						stops: overlayBlurMaskStops,
					})}
					style={StyleSheet.absoluteFill}
				>
					<BlurView
						blurMethod={
							Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined
						}
						intensity={BASE_PAGE_OVERLAY_BLUR_INTENSITY}
						style={StyleSheet.absoluteFill}
						tint='systemChromeMaterial'
					/>
				</MaskedView>
			) : null}

			<Svg
				height={height}
				preserveAspectRatio='none'
				style={showOverlayBlur ? StyleSheet.absoluteFill : undefined}
				width='100%'
			>
				<Defs>
					{isOverlay ? (
						<LinearGradient
							id={gradientId}
							x1='0'
							x2='0'
							y1={isTop ? '0' : '1'}
							y2={isTop ? '1' : '0'}
						>
							{renderTintStops(overlayTintStops, backgroundColor)}
						</LinearGradient>
					) : null}

					{!isOverlay ? (
						<LinearGradient
							id={gradientId}
							x1='0'
							x2='0'
							y1={isTop ? '0' : '1'}
							y2={isTop ? '1' : '0'}
						>
							{renderTintStops(scrollFadeStops, backgroundColor)}
						</LinearGradient>
					) : null}
				</Defs>
				<Rect fill={`url(#${gradientId})`} height='100%' width='100%' />
			</Svg>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	blurMaskRoot: {
		backgroundColor: 'transparent',
		flex: 1,
	},
})
