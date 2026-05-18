import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import React from 'react'

export default function TabLayout() {
	return (
		<NativeTabs blurEffect='systemDefault' minimizeBehavior='automatic'>
			<NativeTabs.Trigger name='general/index'>
				<Label>Главная</Label>
				<Icon
					sf={{
						default: 'house',
						selected: 'house.fill',
					}}
				/>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='search/index'>
				<Label>Поиск</Label>
				<Icon
					sf={{
						default: 'magnifyingglass',
						selected: 'magnifyingglass.circle.fill',
					}}
				/>
			</NativeTabs.Trigger>

			<NativeTabs.Trigger name='chats/index'>
				<Label>Чаты</Label>
				<Icon
					sf={{
						default: 'message',
						selected: 'message.fill',
					}}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name='index'>
				<Label>Профиль</Label>
				<Icon
					sf={{
						default: 'person',
						selected: 'person.fill',
					}}
				/>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name='settings/index'>
				<Label>Настройки</Label>
				<Icon
					sf={{
						default: 'gearshape',
						selected: 'gearshape.fill',
					}}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	)
}
