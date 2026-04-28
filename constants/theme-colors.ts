/**
 * Native-side mirror of `--background` from heroui-native CSS theme.
 * Used to paint the root window (status bar / safe-area / nav-bar zones)
 * via `expo-system-ui` and as a fallback `contentStyle` for navigators,
 * since native containers cannot read CSS variables from Uniwind/Tailwind.
 *
 * Keep these in sync with:
 *   node_modules/heroui-native/lib/module/styles/theme.css
 *   (`--background` in light/dark variants).
 */
export const THEME_BACKGROUND_COLORS = {
	light: '#F7F7F7',
	dark: '#1C1C1F',
} as const

export type ThemeBackgroundScheme = keyof typeof THEME_BACKGROUND_COLORS
