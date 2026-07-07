import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { BasePageLoader } from '@/components/shared/components/base-page-loader/base-page-loader'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useAuth } from '@/stores/auth'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Avatar, useThemeColor } from 'heroui-native'
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
			<View className='justify-center items-center bg-surface p-3 rounded-2xl'>
				<Ionicons name={icon} size={22} color={iconColor} />
			</View>

			<View className='flex-1 gap-1'>
				<Text
					className='font-semibold text-foreground text-base'
					style={{ color: labelColor }}
				>
					{label}
				</Text>
				{subtitle ? (
					<Text className='text-muted text-sm' numberOfLines={2}>
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
	const { t: tMasterMenu } = useScopedTranslation('pages', 'profile.masterMenu')
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
					<View className='items-center px-5 pt-8 pb-6'>
						<View
							className='justify-center items-center bg-surface mb-5 border-4 rounded-full'
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
							<BasePageLoader variant='profile' showHeader={false} />
						) : activeProfile ? (
							<View className='items-center gap-3 w-full'>
								<Text className='font-bold text-foreground text-2xl text-center'>
									{displayName}
								</Text>

								<View className='flex-row items-center gap-2 bg-surface mt-1 mb-2 p-3 rounded-2xl'>
									<Ionicons name='star' size={18} color={accentColor} />
									<Text className='font-semibold text-foreground text-base'>
										{t('ratingChip', { rating })}
									</Text>
								</View>

								{masterDescription ? (
									<Text
										className='mt-1 px-2 py-2 text-muted text-sm text-center'
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
									mode === 'master' ? t('masterNotFound') : t('clientNotFound')
								}
							/>
						)}
					</View>
				</View>

				{mode === 'master' && masterProfile ? (
					<View className='gap-2 p-2'>
						<Text className='px-1 font-semibold text-muted text-sm uppercase tracking-wide'>
							{tMasterMenu('sectionTitle')}
						</Text>
						<View className='bg-background-secondary border border-border rounded-2xl overflow-hidden'>
							<ProfileMenuRow
								icon='briefcase-outline'
								label={tMasterMenu('myServicesLabel')}
								subtitle={tMasterMenu('myServicesSubtitle')}
								onPress={() => router.push('/master-settings/services')}
							/>
							<ProfileMenuRow
								icon='calendar-outline'
								label={tMasterMenu('scheduleLabel')}
								subtitle={tMasterMenu('scheduleSubtitle')}
								onPress={() => router.push('/master-settings')}
							/>
							<ProfileMenuRow
								icon='settings-outline'
								isLast
								label={tMasterMenu('bookingRulesLabel')}
								onPress={() => router.push('/master-settings/booking')}
							/>
						</View>
					</View>
				) : null}

				<View className='gap-2 p-2'>
					<Text className='px-1 font-semibold text-muted text-sm uppercase tracking-wide'>
						{t('accountManagement')}
					</Text>
					<View className='bg-background-secondary border border-border rounded-2xl overflow-hidden'>
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
