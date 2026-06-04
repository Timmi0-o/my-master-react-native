import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { IUserProfile } from '@/actions/user-profile/models/user-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { useAuth } from '@/configs/auth/auth-context'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import { ACTIVE_PROFILE_MODES } from '@/configs/active-profile-mode/active-profile-mode.types'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, Button, Card, Chip } from 'heroui-native'
import { ScrollView, Text, View } from 'react-native'

const MODE_LABELS: Record<ActiveProfileMode, string> = {
	client: 'Клиент профиль',
	master: 'Мастер профиль',
}

interface IProfilePageProps {
	clientProfile: IUserProfile | null
	masterProfile: IMasterProfile | null
	isClientLoading: boolean
	isMasterLoading: boolean
}

export default function ProfilePage({
	clientProfile,
	masterProfile,
	isClientLoading,
	isMasterLoading,
}: IProfilePageProps) {
	const { signOut } = useAuth()
	const { mode, setMode } = useActiveProfileMode()

	const activeProfile = mode === 'master' ? masterProfile : clientProfile
	const isLoading = mode === 'master' ? isMasterLoading : isClientLoading
	const displayName = activeProfile?.displayName ?? ''
	const rating = activeProfile?.rating
	const avatarLetter = displayName.trim()[0]?.toUpperCase() ?? '?'

	const handleModeChange = (nextMode: ActiveProfileMode) => {
		void setMode(nextMode)
	}

	return (
		<BasePage>
			<ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
				<View style={{ rowGap: 20 }}>
					<Card>
						<Card.Body className='p-0 gap-2'>
							<View className='flex-row gap-2'>
								{ACTIVE_PROFILE_MODES.map((profileMode) => {
									const isSelected = mode === profileMode

									return (
										<Button
											key={profileMode}
											className='flex-1'
											onPress={() => handleModeChange(profileMode)}
											variant={isSelected ? 'primary' : 'outline'}
										>
											<Button.Label>{MODE_LABELS[profileMode]}</Button.Label>
										</Button>
									)
								})}
							</View>
						</Card.Body>
					</Card>

					<Card className='rounded-none shadow-none bg-background-secondary'>
						<Card.Header className='flex items-center gap-3'>
							<Avatar
								alt={displayName || MODE_LABELS[mode]}
								color='accent'
								style={{ width: 100, height: 100 }}
							>
								<Avatar.Fallback
									textProps={{
										className: 'text-xl font-bold',
									}}
								>
									{avatarLetter}
								</Avatar.Fallback>
							</Avatar>

							{isLoading ? (
								<Text className='text-base text-muted'>Загрузка...</Text>
							) : activeProfile ? (
								<>
									<Text
										className='text-foreground'
										style={{ fontSize: 28, fontWeight: 'bold' }}
									>
										{displayName}
									</Text>
									<View className='mt-3 flex-row gap-3'>
										<Chip color='default'>Рейтинг: {rating}</Chip>
										<Chip color='accent'>{MODE_LABELS[mode]}</Chip>
									</View>
								</>
							) : (
								<Text className='text-base text-muted text-center px-4'>
									{mode === 'master'
										? 'Профиль мастера не найден'
										: 'Профиль клиента не найден'}
								</Text>
							)}
						</Card.Header>
					</Card>

					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>
								Управление аккаунтом
							</Text>
						</Card.Header>

						<Card.Body className='mt-4 p-0'>
							<View className='mt-3 gap-2'>
								<Button variant='tertiary' isDisabled>
									<Ionicons
										name='lock-closed-outline'
										size={20}
										color='white'
									/>
									<Button.Label>Изменить пароль</Button.Label>
								</Button>
								<Button variant='danger' onPress={() => signOut()}>
									<Ionicons name='log-out-outline' size={20} color='white' />
									<Button.Label>Выйти</Button.Label>
								</Button>
							</View>
						</Card.Body>
					</Card>
				</View>
			</ScrollView>
		</BasePage>
	)
}
