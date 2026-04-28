import { PageScreen } from '@/components/ui/page-screen'
import { useThemeApp } from '@/configs/theme/theme-context'
import { Card, Switch } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

export default function SettingsPage(): ReactElement {
	const { resolvedColorScheme, setDarkModeEnabled } = useThemeApp()

	return (
		<PageScreen>
			<View className='flex-1 pt-1'>
				<Card>
					<Card.Header>
						<Text className='text-lg font-bold text-foreground'>
							Внешний вид
						</Text>
					</Card.Header>
					<Card.Body className='mt-4 p-0'>
						<View className='flex-row items-center justify-between gap-3'>
							<View className='flex-1'>
								<Text className='text-base text-foreground'>Темная тема</Text>
								<Text className='mt-1 text-sm text-foreground'>
									Включает темное оформление приложения
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
		</PageScreen>
	)
}
