import { ACCENT_PALETTES } from '@/configs/theme/accent-palettes'
import { useThemeApp } from '@/configs/theme/theme-context'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Card, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'

const SWATCH_SIZE = 36

export function AccentColorSwitcher(): ReactElement {
	const { accentId, setAccentId } = useThemeApp()
	const { t } = useScopedTranslation('pages', 'settings.accent')
	const foregroundColor = useThemeColor('foreground')

	return (
		<Card>
			<Card.Header>
				<Text className='text-lg font-bold text-foreground'>{t('title')}</Text>
			</Card.Header>
			<Card.Body className='mt-2 gap-3 p-0'>
				<Text className='text-sm text-foreground'>{t('hint')}</Text>
				<View className='flex-row flex-wrap gap-3'>
					{ACCENT_PALETTES.map((palette) => {
						const isSelected = accentId === palette.id

						return (
							<Pressable
								key={palette.id}
								accessibilityRole='button'
								accessibilityState={{ selected: isSelected }}
								onPress={() => {
									void setAccentId(palette.id)
								}}
								style={{
									width: SWATCH_SIZE,
									height: SWATCH_SIZE,
									borderRadius: SWATCH_SIZE / 2,
									backgroundColor: palette.previewHex,
									borderWidth: isSelected ? 2 : 0,
									borderColor: isSelected ? foregroundColor : 'transparent',
								}}
							/>
						)
					})}
				</View>
			</Card.Body>
		</Card>
	)
}
