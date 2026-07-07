import { Uniwind } from 'uniwind'

const SNOW = 'oklch(0.9911 0 0)'
const ECLIPSE = 'oklch(0.2103 0.0059 285.89)'

export type AccentPaletteId =
	| 'blue'
	| 'indigo'
	| 'violet'
	| 'purple'
	| 'fuchsia'
	| 'pink'
	| 'rose'
	| 'red'
	| 'orange'
	| 'amber'
	| 'yellow'
	| 'lime'
	| 'green'
	| 'emerald'
	| 'teal'
	| 'cyan'
	| 'sky'
	| 'slate'
	| 'zinc'
	| 'stone'

export interface IAccentPalette {
	id: AccentPaletteId
	previewHex: string
	light: {
		accent: string
		accentForeground: string
	}
	dark: {
		accent: string
		accentForeground: string
	}
}

export const DEFAULT_ACCENT_PALETTE_ID: AccentPaletteId = 'blue'

export const ACCENT_PALETTES: IAccentPalette[] = [
	{
		id: 'blue',
		previewHex: '#0485f7',
		light: { accent: 'oklch(0.6204 0.195 253.83)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.6804 0.195 253.83)', accentForeground: SNOW },
	},
	{
		id: 'indigo',
		previewHex: '#6367ef',
		light: { accent: 'oklch(0.585 0.2 277)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.645 0.2 277)', accentForeground: SNOW },
	},
	{
		id: 'violet',
		previewHex: '#8756f1',
		light: { accent: 'oklch(0.59 0.22 293)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.65 0.22 293)', accentForeground: SNOW },
	},
	{
		id: 'purple',
		previewHex: '#954ede',
		light: { accent: 'oklch(0.58 0.21 303)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.64 0.21 303)', accentForeground: SNOW },
	},
	{
		id: 'fuchsia',
		previewHex: '#c53fd9',
		light: { accent: 'oklch(0.62 0.24 322)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.68 0.24 322)', accentForeground: SNOW },
	},
	{
		id: 'pink',
		previewHex: '#ea4ca4',
		light: { accent: 'oklch(0.66 0.21 350)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.72 0.21 350)', accentForeground: SNOW },
	},
	{
		id: 'rose',
		previewHex: '#ef3565',
		light: { accent: 'oklch(0.63 0.22 12)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.69 0.22 12)', accentForeground: SNOW },
	},
	{
		id: 'red',
		previewHex: '#e32631',
		light: { accent: 'oklch(0.59 0.22 25)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.65 0.22 25)', accentForeground: SNOW },
	},
	{
		id: 'orange',
		previewHex: '#f3680f',
		light: { accent: 'oklch(0.68 0.19 45)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.74 0.19 45)', accentForeground: ECLIPSE },
	},
	{
		id: 'amber',
		previewHex: '#eb9a04',
		light: { accent: 'oklch(0.75 0.16 72)', accentForeground: ECLIPSE },
		dark: { accent: 'oklch(0.78 0.16 72)', accentForeground: ECLIPSE },
	},
	{
		id: 'yellow',
		previewHex: '#e9c944',
		light: { accent: 'oklch(0.84 0.15 95)', accentForeground: ECLIPSE },
		dark: { accent: 'oklch(0.86 0.15 95)', accentForeground: ECLIPSE },
	},
	{
		id: 'lime',
		previewHex: '#8fc531',
		light: { accent: 'oklch(0.76 0.18 128)', accentForeground: ECLIPSE },
		dark: { accent: 'oklch(0.8 0.18 128)', accentForeground: ECLIPSE },
	},
	{
		id: 'green',
		previewHex: '#37a643',
		light: { accent: 'oklch(0.64 0.17 145)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.7 0.17 145)', accentForeground: SNOW },
	},
	{
		id: 'emerald',
		previewHex: '#00ae77',
		light: { accent: 'oklch(0.66 0.15 163)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.72 0.15 163)', accentForeground: SNOW },
	},
	{
		id: 'teal',
		previewHex: '#00a396',
		light: { accent: 'oklch(0.64 0.12 185)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.7 0.12 185)', accentForeground: SNOW },
	},
	{
		id: 'cyan',
		previewHex: '#00adbb',
		light: { accent: 'oklch(0.68 0.12 205)', accentForeground: ECLIPSE },
		dark: { accent: 'oklch(0.74 0.12 205)', accentForeground: ECLIPSE },
	},
	{
		id: 'sky',
		previewHex: '#00a7dd',
		light: { accent: 'oklch(0.68 0.14 230)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.74 0.14 230)', accentForeground: SNOW },
	},
	{
		id: 'slate',
		previewHex: '#5f6a7b',
		light: { accent: 'oklch(0.52 0.03 260)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.62 0.03 260)', accentForeground: SNOW },
	},
	{
		id: 'zinc',
		previewHex: '#717177',
		light: { accent: 'oklch(0.55 0.01 286)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.65 0.01 286)', accentForeground: SNOW },
	},
	{
		id: 'stone',
		previewHex: '#81796e',
		light: { accent: 'oklch(0.58 0.02 75)', accentForeground: SNOW },
		dark: { accent: 'oklch(0.66 0.02 75)', accentForeground: SNOW },
	},
]

const paletteById = new Map(
	ACCENT_PALETTES.map((palette) => [palette.id, palette]),
)

export const isAccentPaletteId = (value: string): value is AccentPaletteId =>
	paletteById.has(value as AccentPaletteId)

export const getAccentPaletteById = (id: AccentPaletteId): IAccentPalette =>
	paletteById.get(id) ?? paletteById.get(DEFAULT_ACCENT_PALETTE_ID)!

export const applyAccentPalette = (palette: IAccentPalette): void => {
	Uniwind.updateCSSVariables('light', {
		'--accent': palette.light.accent,
		'--accent-foreground': palette.light.accentForeground,
	})
	Uniwind.updateCSSVariables('dark', {
		'--accent': palette.dark.accent,
		'--accent-foreground': palette.dark.accentForeground,
	})
}
