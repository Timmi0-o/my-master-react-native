import { useAppLocale } from '@/configs/i18n/locale-context'
import { LOCALE_OPTIONS } from '@/configs/i18n/supported-locales'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Button, Card } from 'heroui-native'
import { Text, View } from 'react-native'

export const LanguageSwitcher = () => {
	const { locale, setLocale } = useAppLocale()
	const { t } = useScopedTranslation('pages', 'settings.language')

	return (
		<Card>
			<Card.Header>
				<Text className='text-lg font-bold text-foreground'>
					{t('title')}
				</Text>
			</Card.Header>
			<Card.Body className='mt-2 p-0 gap-3'>
				<Text className='text-sm text-foreground'>{t('hint')}</Text>
				<View className='flex-row flex-wrap gap-2'>
					{LOCALE_OPTIONS.map(({ locale: optionLocale, label }) => {
						const isSelected = locale === optionLocale

						return (
							<Button
								key={optionLocale}
								size='sm'
								onPress={() => {
									void setLocale(optionLocale)
								}}
								variant={isSelected ? 'primary' : 'outline'}
							>
								<Button.Label>{label}</Button.Label>
							</Button>
						)
					})}
				</View>
			</Card.Body>
		</Card>
	)
}
