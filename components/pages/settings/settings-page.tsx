import { BasePage } from '@/components/shared/components/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useThemeApp } from '@/configs/theme/theme-context'
import { Card, Switch } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { LanguageSwitcher } from './components/language-switcher/language-switcher'

export default function SettingsPage(): ReactElement {
	const { t } = useScopedTranslation('pages', 'settings')
	const { resolvedColorScheme, setDarkModeEnabled } = useThemeApp()

	return (
		<BasePage>
			<View className='flex-1 pt-1 gap-3'>
				<Text className='text-2xl font-bold text-foreground ml-2'>
					{t('title')}
				</Text>
				<LanguageSwitcher />
				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>
							{t('appearance.title')}
						</Text>
					</Card.Header>
					<Card.Body className='mt-4 p-0'>
						<View className='flex-row items-center justify-between gap-3'>
							<View className='flex-1'>
								<Text className='text-base text-foreground'>
									{t('appearance.darkMode')}
								</Text>
								<Text className='mt-1 text-sm text-foreground'>
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
			</View>
		</BasePage>
	)
}
