import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { AccentColorSwitcher } from './components/accent-color-switcher/accent-color-switcher'
import { LanguageSwitcher } from './components/language-switcher/language-switcher'
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher'

export default function SettingsPage(): ReactElement {
	const { t } = useScopedTranslation('pages', 'settings')

	return (
		<BasePage
			headerContent={
				<Text className='ml-2 font-bold text-foreground text-2xl'>
					{t('title')}
				</Text>
			}
		>
			<View className='flex-1 gap-3 pt-1'>
				<LanguageSwitcher />

				<ThemeSwitcher />

				<AccentColorSwitcher />
			</View>
		</BasePage>
	)
}
