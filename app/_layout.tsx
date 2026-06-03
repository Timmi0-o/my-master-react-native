import '@/app/global.css'
import { AuthProvider, useAuth } from '@/configs/auth/auth-context'
import { ThemeProviderApp, useThemeApp } from '@/configs/theme/theme-context'
import { THEME_BACKGROUND_COLORS } from '@/constants/theme-colors'
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from 'expo-router/react-navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { HeroUINativeProvider } from 'heroui-native'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync().catch(() => {})

const RootStack = observer(() => {
	const { state } = useAuth()
	const { resolvedColorScheme } = useThemeApp()

	useEffect(() => {
		if (state.status !== 'loading') {
			SplashScreen.hideAsync().catch(() => {})
		}
	}, [state.status])

	if (state.status === 'loading') return null

	const isAuthenticated = state.status === 'authenticated'
	const backgroundColor = THEME_BACKGROUND_COLORS[resolvedColorScheme]

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor },
			}}
		>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name='(auth)' />
			</Stack.Protected>
		</Stack>
	)
})

const queryClient = new QueryClient()

const AppNavigation = () => {
	const { resolvedColorScheme } = useThemeApp()

	return (
		<ThemeProvider
			value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<AuthProvider>
				<RootStack />
				<StatusBar style={resolvedColorScheme === 'dark' ? 'light' : 'dark'} />
			</AuthProvider>
		</ThemeProvider>
	)
}

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SafeAreaProvider>
					<HeroUINativeProvider>
						<ThemeProviderApp>
							<AppNavigation />
						</ThemeProviderApp>
					</HeroUINativeProvider>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	)
}
