import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { BasePage } from '@/components/shared/components/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useAuth } from '@/configs/auth/auth-context'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, Spinner, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ProfileModeSwitcher } from './components/mode-switcher'

interface IProfilePageProps {
	clientProfile: IUserProfile | null
	masterProfile: IMasterProfile | null
	isClientLoading: boolean
	isMasterLoading: boolean
}

interface IProfileMenuRowProps {
	icon: keyof typeof Ionicons.glyphMap
	label: string
	subtitle?: string
	onPress?: () => void
	isDisabled?: boolean
	isDanger?: boolean
	isLast?: boolean
}

function ProfileMenuRow({
	icon,
	label,
	subtitle,
	onPress,
	isDisabled = false,
	isDanger = false,
	isLast = false,
}: IProfileMenuRowProps): ReactElement {
	const [mutedColor, dangerColor, foregroundColor] = useThemeColor([
		'muted',
		'danger',
		'foreground',
	])
	const iconColor = isDanger ? dangerColor : mutedColor
	const labelColor = isDanger ? dangerColor : foregroundColor

	return (
		<Pressable
			accessibilityRole='button'
			accessibilityState={{ disabled: isDisabled }}
			className={`flex-row items-center gap-3 px-2 py-2 active:opacity-80 ${
				isDisabled ? 'opacity-50' : ''
			} ${isLast ? '' : 'border-b border-border'}`}
			disabled={isDisabled}
			onPress={onPress}
		>
			<View className='items-center justify-center rounded-2xl bg-surface p-3'>
				<Ionicons name={icon} size={22} color={iconColor} />
			</View>

			<View className='flex-1 gap-1'>
				<Text
					className='text-base font-semibold text-foreground'
					style={{ color: labelColor }}
				>
					{label}
				</Text>
				{subtitle ? (
					<Text className='text-sm text-muted' numberOfLines={2}>
						{subtitle}
					</Text>
				) : null}
			</View>

			{!isDisabled && onPress ? (
				<Ionicons name='chevron-forward' size={20} color={mutedColor} />
			) : null}
		</Pressable>
	)
}

export default function ProfilePage({
	clientProfile,
	masterProfile,
	isClientLoading,
	isMasterLoading,
}: IProfilePageProps): ReactElement {
	const { signOut } = useAuth()
	const router = useRouter()

	const { t } = useScopedTranslation('pages', 'profile')
	const { t: tMasterSettings } = useScopedTranslation('pages', 'masterSettings')
	const { t: tBtn } = useScopedTranslation('ui', 'button')

	const profileModeLabel = useEnumLabel('enums.profileMode')
	const [accentColor] = useThemeColor(['accent'])

	const { mode, setMode } = useActiveProfileMode()

	const activeProfile = mode === 'master' ? masterProfile : clientProfile
	const isLoading = mode === 'master' ? isMasterLoading : isClientLoading
	const displayName = activeProfile?.displayName ?? ''
	const rating = activeProfile?.rating
	const avatarLetter = displayName.trim()[0]?.toUpperCase() ?? '?'
	const masterDescription =
		mode === 'master' && masterProfile?.description
			? masterProfile.description
			: null

	const handleModeChange = (nextMode: ActiveProfileMode) => {
		void setMode(nextMode)
	}

	return (
		<BasePage>
			<View className='gap-5 px-1 pb-4'>
				<View className='p-2'>
					<ProfileModeSwitcher
						mode={mode}
						onModeChange={handleModeChange}
						getModeLabel={profileModeLabel}
					/>
				</View>

				<View className='overflow-hidden'>
					<View className='items-center px-5 pb-6 pt-8'>
						<View
							className='mb-5 items-center justify-center rounded-full border-4 bg-surface'
							style={{
								borderColor: accentColor,
								width: 112,
								height: 112,
							}}
						>
							<Avatar
								alt={displayName || profileModeLabel(mode)}
								color='accent'
								style={{ width: 96, height: 96 }}
							>
								<Avatar.Fallback
									textProps={{
										className: 'text-3xl font-bold',
									}}
								>
									{avatarLetter}
								</Avatar.Fallback>
							</Avatar>
						</View>

						{isLoading ? (
							<View className='flex-row items-center gap-2'>
								<Spinner size='sm' />
								<Text className='text-base text-muted'>{t('loading')}</Text>
							</View>
						) : activeProfile ? (
							<View className='w-full items-center gap-3'>
								<Text className='text-center text-2xl font-bold text-foreground'>
									{displayName}
								</Text>

								<View className='rounded-full bg-surface px-3 py-2'>
									<Text className='text-xs font-medium uppercase tracking-wide text-muted'>
										{profileModeLabel(mode)}
									</Text>
								</View>

								<View className='mt-1 mb-2 flex-row items-center gap-2 rounded-2xl bg-surface p-3'>
									<Ionicons name='star' size={18} color={accentColor} />
									<Text className='text-base font-semibold text-foreground'>
										{t('ratingChip', { rating })}
									</Text>
								</View>

								{masterDescription ? (
									<Text
										className='mt-1 px-2 py-2 text-center text-sm text-muted'
										numberOfLines={3}
									>
										{masterDescription}
									</Text>
								) : null}
							</View>
						) : (
							<DataNotFound
								compact
								message={
									mode === 'master'
										? t('masterNotFound')
										: t('clientNotFound')
								}
							/>
						)}
					</View>
				</View>

				{mode === 'master' && masterProfile ? (
					<View className='gap-2 p-2'>
						<Text className='px-1 text-sm font-semibold uppercase tracking-wide text-muted'>
							{tMasterSettings('hubTitle')}
						</Text>
						<View className='overflow-hidden rounded-2xl border border-border bg-background-secondary'>
							<ProfileMenuRow
								icon='calendar-outline'
								label={tBtn('configureSchedule')}
								subtitle={tMasterSettings('weeklySchedule')}
								onPress={() => router.push('/master-settings')}
							/>
							<ProfileMenuRow
								icon='settings-outline'
								isLast
								label={tMasterSettings('bookingRules')}
								onPress={() => router.push('/master-settings/booking')}
							/>
						</View>
					</View>
				) : null}

				<View className='gap-2 p-2'>
					<Text className='px-1 text-sm font-semibold uppercase tracking-wide text-muted'>
						{t('accountManagement')}
					</Text>
					<View className='overflow-hidden rounded-2xl border border-border bg-background-secondary'>
						<ProfileMenuRow
							icon='lock-closed-outline'
							isDisabled
							label={tBtn('changePassword')}
						/>
						<ProfileMenuRow
							icon='log-out-outline'
							isDanger
							isLast
							label={tBtn('signOut')}
							onPress={() => signOut()}
						/>
					</View>
				</View>
			</View>
		</BasePage>
	)
}
