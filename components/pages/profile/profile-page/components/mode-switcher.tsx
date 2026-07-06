import {
	ACTIVE_PROFILE_MODES,
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
	return (
		<Tabs
			className='w-full'
			value={mode}
			onValueChange={(value) => onModeChange(value as ActiveProfileMode)}
			variant='primary'
		>
			<Tabs.List className='w-full self-stretch'>
				<Tabs.Indicator />
				{ACTIVE_PROFILE_MODES.map((profileMode) => (
					<Tabs.Trigger
						key={profileMode}
						className='flex-1 py-2'
						value={profileMode}
					>
						<Tabs.Label className='text-sm font-semibold'>
							{getModeLabel(profileMode)}
						</Tabs.Label>
					</Tabs.Trigger>
				))}
			</Tabs.List>
		</Tabs>
	)
}
