import {
	ACTIVE_PROFILE_MODES,
	isActiveProfileMode,
	type ActiveProfileMode,
} from '@/configs/active-profile-mode/active-profile-mode.types'
import { Tabs } from 'heroui-native'
import type { ReactElement } from 'react'

interface IProfileModeSwitcherProps {
	mode: ActiveProfileMode
	onModeChange: (nextMode: ActiveProfileMode) => void
	getModeLabel: (profileMode: ActiveProfileMode) => string
}

export function ProfileModeSwitcher({
	mode,
	onModeChange,
	getModeLabel,
}: IProfileModeSwitcherProps): ReactElement {
	const handleValueChange = (value: string): void => {
		if (isActiveProfileMode(value)) {
			onModeChange(value)
		}
	}

	return (
		<Tabs
			className='w-full'
			onValueChange={handleValueChange}
			value={mode}
			variant='primary'
		>
			<Tabs.List className='w-full self-stretch'>
				<Tabs.Indicator />
				{ACTIVE_PROFILE_MODES.map((profileMode) => (
					<Tabs.Trigger
						key={profileMode}
						className='flex-1'
						value={profileMode}
					>
						<Tabs.Label className='text-sm' numberOfLines={1}>
							{getModeLabel(profileMode)}
						</Tabs.Label>
					</Tabs.Trigger>
				))}
			</Tabs.List>
		</Tabs>
	)
}
