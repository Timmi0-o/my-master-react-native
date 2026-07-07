import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useThemeApp } from '@/configs/theme/theme-context'
import { Card, Switch } from 'heroui-native'
import { Text, View } from 'react-native'

export function ThemeSwitcher() {
	const { t } = useScopedTranslation('pages', 'settings')

	const { resolvedColorScheme, setDarkModeEnabled } = useThemeApp()

	return (
		<Card>
			<Card.Header>
				<Text className='font-bold text-foreground text-lg'>
					{t('appearance.title')}
				</Text>
			</Card.Header>
			<Card.Body className='mt-4 p-0'>
				<View className='flex-row justify-between items-center gap-3'>
					<View className='flex-1'>
						<Text className='text-foreground text-base'>
							{t('appearance.darkMode')}
						</Text>
						<Text className='mt-1 text-foreground text-sm'>
							{t('appearance.darkModeHint')}
						</Text>
					</View>
					<Switch
						isSelected={resolvedColorScheme === 'dark'}
						onSelectedChange={(isSelected) => {
							void setDarkModeEnabled(isSelected)
						}}
					/>
				</View>
			</Card.Body>
		</Card>
	)
}
