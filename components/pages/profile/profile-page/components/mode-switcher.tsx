import {
	ACTIVE_PROFILE_MODES,
	type ActiveProfileMode,
} from '@/configs/active-profile-mode/active-profile-mode.types'
import { cn } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'

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
		<View
			accessibilityRole='tablist'
			className='w-full flex-row gap-1 rounded-2xl bg-surface p-1'
		>
			{ACTIVE_PROFILE_MODES.map((profileMode) => {
				const isActive = mode === profileMode

				return (
					<Pressable
						key={profileMode}
						accessibilityRole='tab'
						accessibilityState={{ selected: isActive }}
						className={cn(
							'flex-1 items-center rounded-xl py-2 active:opacity-80',
							isActive && 'bg-accent',
						)}
						onPress={() => onModeChange(profileMode)}
					>
						<Text
							className={cn(
								'text-center text-sm font-semibold',
								isActive ? 'text-accent-foreground' : 'text-muted',
							)}
							numberOfLines={1}
						>
							{getModeLabel(profileMode)}
						</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
