import { NativeTabs } from 'expo-router/unstable-native-tabs'
import React from 'react'

export default function TabLayout() {
	return (
		<NativeTabs blurEffect='systemDefault' minimizeBehavior='automatic'>
			<NativeTabs.Trigger name='general/index'>
				<NativeTabs.Trigger.Label>Главная</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					sf={{
						default: 'house',
						selected: 'house.fill',
					}}
				/>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='search/index'>
				<NativeTabs.Trigger.Label>Поиск</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					sf={{
						default: 'magnifyingglass',
						selected: 'magnifyingglass.circle.fill',
					}}
				/>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='chats/index'>
				<NativeTabs.Trigger.Label>Чаты</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					sf={{
						default: 'message',
						selected: 'message.fill',
					}}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name='index'>
				<NativeTabs.Trigger.Label>Профиль</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					sf={{
						default: 'person',
						selected: 'person.fill',
					}}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name='settings/index'>
				<NativeTabs.Trigger.Label>Настройки</NativeTabs.Trigger.Label>
				<NativeTabs.Trigger.Icon
					sf={{
						default: 'gearshape',
						selected: 'gearshape.fill',
					}}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
