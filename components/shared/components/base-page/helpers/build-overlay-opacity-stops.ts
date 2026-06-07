export interface IOverlayOpacityStop {
	offset: number
	opacity: number
}

type TOverlayStopAnchor = 'start' | 'end'

const OVERLAY_GRADIENT_STOP_COUNT = 14
const OVERLAY_MAX_OPACITY = 0.52
/** >1 = дольше держит затемнение у chrome, мягче уходит в контент. */
const OVERLAY_FALLOFF_POWER = 2.2
/** Blur чуть шире tint — мягче уходит в контент. */
const OVERLAY_BLUR_FALLOFF_POWER = 1.85

function roundOffset(value: number): number {
	return Math.round(value * 1000) / 1000
}

function roundOpacity(value: number): number {
	return Math.round(value * 100) / 100
}

function clampChromeZoneRatio(chromeZoneRatio: number): number {
	return Math.min(Math.max(chromeZoneRatio, 0), 1)
}

function buildOverlayStopsFromStart(
	maxOpacity: number,
	falloffPower: number,
): IOverlayOpacityStop[] {
	const stops: IOverlayOpacityStop[] = []

	for (let index = 0; index <= OVERLAY_GRADIENT_STOP_COUNT; index += 1) {
		const offset = index / OVERLAY_GRADIENT_STOP_COUNT
		const falloff = 1 - offset
		const opacity =
			offset === 0
				? maxOpacity
				: roundOpacity(maxOpacity * falloff ** falloffPower)

		stops.push({
			offset: roundOffset(offset),
			opacity,
		})
	}

	return stops
}

export function buildOpacityStopsWithChromePlateau(
	maxOpacity: number,
	falloffPower: number,
	chromeZoneRatio: number,
	anchor: TOverlayStopAnchor,
): IOverlayOpacityStop[] {
	const clampedRatio = clampChromeZoneRatio(chromeZoneRatio)
	const featherSpan = 1 - clampedRatio

	if (clampedRatio <= 0 || featherSpan <= 0) {
		return anchor === 'start'
			? buildOverlayStopsFromStart(maxOpacity, falloffPower)
			: buildOverlayStopsFromStart(maxOpacity, falloffPower)
					.map((stop) => ({
						offset: roundOffset(1 - stop.offset),
						opacity: stop.opacity,
					}))
					.sort((left, right) => left.offset - right.offset)
	}

	const stops: IOverlayOpacityStop[] = []

	if (anchor === 'start') {
		stops.push({ offset: 0, opacity: maxOpacity })
		stops.push({ offset: roundOffset(clampedRatio), opacity: maxOpacity })

		for (let index = 1; index <= OVERLAY_GRADIENT_STOP_COUNT; index += 1) {
			const featherOffset = index / OVERLAY_GRADIENT_STOP_COUNT
			const falloff = 1 - featherOffset
			stops.push({
				offset: roundOffset(clampedRatio + featherSpan * featherOffset),
				opacity: roundOpacity(maxOpacity * falloff ** falloffPower),
			})
		}

		return stops
	}

	stops.push({ offset: 1, opacity: maxOpacity })
	stops.push({ offset: roundOffset(1 - clampedRatio), opacity: maxOpacity })

	for (let index = 1; index <= OVERLAY_GRADIENT_STOP_COUNT; index += 1) {
		const featherOffset = index / OVERLAY_GRADIENT_STOP_COUNT
		const falloff = 1 - featherOffset
		stops.push({
			offset: roundOffset(1 - clampedRatio - featherSpan * featherOffset),
			opacity: roundOpacity(maxOpacity * falloff ** falloffPower),
		})
	}

	return stops.sort((left, right) => left.offset - right.offset)
}

/** Tint: плато под chrome, растушёвка только в feather-зоне. */
export function buildOverlayOpacityStopsWithChromePlateau(
	chromeZoneRatio: number,
	anchor: TOverlayStopAnchor,
): IOverlayOpacityStop[] {
	return buildOpacityStopsWithChromePlateau(
		OVERLAY_MAX_OPACITY,
		OVERLAY_FALLOFF_POWER,
		chromeZoneRatio,
		anchor,
	)
}

/** Маска blur: то же плато + feather. */
export function buildOverlayBlurMaskStopsWithChromePlateau(
	chromeZoneRatio: number,
	anchor: TOverlayStopAnchor,
): IOverlayOpacityStop[] {
	return buildOpacityStopsWithChromePlateau(
		1,
		OVERLAY_BLUR_FALLOFF_POWER,
		chromeZoneRatio,
		anchor,
	)
}
