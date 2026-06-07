import type { Edge } from 'react-native-safe-area-context'

export const BASE_PAGE_DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom']
export const BASE_PAGE_EDGE_FADE_DISTANCE = 48
export const BASE_PAGE_EDGE_FADE_EXTENT = 24
/** Scroll edge-fade: плато под safe area, мягкая растушёвка в feather-зоне. */
export const BASE_PAGE_SCROLL_FADE_MAX_OPACITY = 0.97
export const BASE_PAGE_SCROLL_FADE_FALLOFF_POWER = 2
export const BASE_PAGE_HEADER_CONTENT_MIN_HEIGHT = 52
export const BASE_PAGE_FOOTER_CONTENT_MIN_HEIGHT = 52
export const BASE_PAGE_FOOTER_PADDING_TOP = 10
export const BASE_PAGE_OVERLAY_FADE_HEIGHT = 8
/** Лёгкий blur под chrome; маска повторяет кривую overlay-fade. */
export const BASE_PAGE_OVERLAY_BLUR_INTENSITY = 34
export const BASE_PAGE_PULL_REFRESH_INDICATOR_HEIGHT = 40
export const BASE_PAGE_PULL_REFRESH_RESET_RATIO = 0.85
