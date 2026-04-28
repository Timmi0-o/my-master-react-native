import { IUser } from '@/actions/user/models/user.schema'
import { PageScreen } from '@/components/ui/page-screen'
import { useAuth } from '@/configs/auth/auth-context'
import { Avatar, Button, Card, Chip } from 'heroui-native'
import { ScrollView, Text, View } from 'react-native'

export default function ProfilePage({ data }: { data: IUser }) {
	const { signOut } = useAuth()

	return (
		<PageScreen>
			<ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
				<View style={{ rowGap: 20 }}>
					<Card className='rounded-none'>
						<Card.Header className='flex items-center'>
							<Avatar alt={data.name} size='lg' color='accent'>
								<Avatar.Fallback
									textProps={{
										className: 'text-xl font-bold',
									}}
								>
									{data.name[0]}
								</Avatar.Fallback>
							</Avatar>

							<Text className='text-2xl text-foreground'>{data.name}</Text>
						</Card.Header>

						<Card.Body className='mt-4 p-0'>
							<View className='mt-3 flex-row gap-3'>
								<Chip color='default'>Рейтинг: {data.rating}</Chip>
								<Chip color='accent'>Отзывов: {data.reviewsCount}</Chip>
							</View>
						</Card.Body>
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
									Изменить пароль
								</Button>
								<Button variant='danger' onPress={() => signOut()}>
									Выйти
								</Button>
							</View>
						</Card.Body>
					</Card>
				</View>
			</ScrollView>
		</PageScreen>
	)
}
