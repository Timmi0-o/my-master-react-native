import { NavigationTab } from '@/components/shared/ui/navigation-tab'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

export default function TabLayout() {
	const { mode } = useActiveProfileMode()
	const { t } = useScopedTranslation('pages', 'tabs')
	const router = useRouter()
	const segments = useSegments()
	const showSearchTab = mode === 'client'

	useEffect(() => {
		if (!showSearchTab && (segments as string[]).includes('search')) {
			router.replace('/(tabs)/general')
		}
	}, [router, segments, showSearchTab])

	return (
		<NavigationTab blurEffect='systemDefault' minimizeBehavior='automatic'>
			<NavigationTab.Trigger name='general/index'>
				<NavigationTab.Trigger.Label>{t('home')}</NavigationTab.Trigger.Label>
				<NavigationTab.Trigger.Icon
					md={{ default: 'home', selected: 'home-filled' }}
					sf={{
						default: 'house',
						selected: 'house.fill',
					}}
				/>
			</NavigationTab.Trigger>

			{showSearchTab ? (
				<NavigationTab.Trigger name='search/index'>
					<NavigationTab.Trigger.Label>
						{t('search')}
					</NavigationTab.Trigger.Label>
					<NavigationTab.Trigger.Icon
						md={{ default: 'search', selected: 'search' }}
						sf={{
							default: 'magnifyingglass',
							selected: 'magnifyingglass.circle.fill',
						}}
					/>
				</NavigationTab.Trigger>
			) : null}

			<NavigationTab.Trigger name='chats/index'>
				<NavigationTab.Trigger.Label>{t('chats')}</NavigationTab.Trigger.Label>
				<NavigationTab.Trigger.Icon
					md={{ default: 'chat-bubble-outline', selected: 'chat-bubble' }}
					sf={{
						default: 'message',
						selected: 'message.fill',
					}}
				/>
			</NavigationTab.Trigger>

			<NavigationTab.Trigger name='index'>
				<NavigationTab.Trigger.Label>
					{t('profile')}
				</NavigationTab.Trigger.Label>
				<NavigationTab.Trigger.Icon
					md={{ default: 'person-outline', selected: 'person' }}
					sf={{
						default: 'person',
						selected: 'person.fill',
					}}
				/>
			</NavigationTab.Trigger>

			<NavigationTab.Trigger name='settings/index'>
				<NavigationTab.Trigger.Label>
					{t('settings')}
				</NavigationTab.Trigger.Label>
				<NavigationTab.Trigger.Icon
					md={{ default: 'settings', selected: 'settings' }}
					sf={{
						default: 'gearshape',
						selected: 'gearshape.fill',
					}}
				/>
			</NavigationTab.Trigger>
		</NavigationTab>
	)
}
