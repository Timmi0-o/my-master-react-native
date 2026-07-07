import { NavigationTab } from '@/components/shared/ui/navigation-tab'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

export default function TabLayout() {
	const { mode } = useActiveProfileMode()
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
				<NavigationTab.Trigger.Icon
					ion={{ default: 'home-outline', selected: 'home' }}
					sf={{
						default: 'house',
						selected: 'house.fill',
					}}
				/>
			</NavigationTab.Trigger>

			{showSearchTab ? (
				<NavigationTab.Trigger name='search/index'>
					<NavigationTab.Trigger.Icon
						ion={{ default: 'search-outline', selected: 'search' }}
						sf={{
							default: 'magnifyingglass',
							selected: 'magnifyingglass',
						}}
					/>
				</NavigationTab.Trigger>
			) : null}

			<NavigationTab.Trigger name='chats/index'>
				<NavigationTab.Trigger.Icon
					ion={{
						default: 'chatbubbles-outline',
						selected: 'chatbubbles',
					}}
					sf={{
						default: 'bubble.left.and.bubble.right',
						selected: 'bubble.left.and.bubble.right.fill',
					}}
				/>
			</NavigationTab.Trigger>

			<NavigationTab.Trigger name='index'>
				<NavigationTab.Trigger.Icon
					ion={{
						default: 'person-circle-outline',
						selected: 'person-circle',
					}}
					sf={{
						default: 'person.crop.circle',
						selected: 'person.crop.circle.fill',
					}}
				/>
			</NavigationTab.Trigger>

			<NavigationTab.Trigger name='settings/index'>
				<NavigationTab.Trigger.Icon
					ion={{ default: 'settings-outline', selected: 'settings' }}
					sf={{
						default: 'gearshape',
						selected: 'gearshape.fill',
					}}
				/>
			</NavigationTab.Trigger>
		</NavigationTab>
	)
}
