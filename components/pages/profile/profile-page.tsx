import { IOrder, IUser } from '@/actions/user/models/user.schema'
import { BasePage } from '@/components/ui/base-page'
import { useAuth } from '@/configs/auth/auth-context'
import { Ionicons } from '@expo/vector-icons'
import { Avatar, Button, Card, Chip, useThemeColor } from 'heroui-native'
import { ScrollView, Text, View } from 'react-native'

export default function ProfilePage({ data }: { data: IUser }) {
	const { signOut } = useAuth()
	const mutedColor = useThemeColor('muted')

	return (
		<BasePage>
			<ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
				<View style={{ rowGap: 20 }}>
					<Card className='rounded-none shadow-none bg-background-secondary'>
						<Card.Header className='flex items-center gap-3'>
							<Avatar
								alt={data.name}
								color='accent'
								style={{ width: 100, height: 100 }}
							>
								<Avatar.Fallback
									textProps={{
										className: 'text-xl font-bold',
									}}
								>
									{data.name[0]}
								</Avatar.Fallback>
							</Avatar>

							<Text
								className='text-foreground'
								style={{ fontSize: 28, fontWeight: 'bold' }}
							>
								{data.name}
							</Text>
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
								Информация
							</Text>
						</Card.Header>
						<Card.Body className='mt-4 p-0 gap-2'>
							<View className='flex-row items-center mt-3 gap-2'>
								<Ionicons name='mail-outline' size={20} color={mutedColor} />
								<Text className='text-base text-foreground'>{data.email}</Text>
							</View>
							<View className='flex-row items-center mt-3 gap-2'>
								<Ionicons name='call-outline' size={20} color={mutedColor} />
								<Text className='text-base text-foreground'>{data.phone}</Text>
							</View>
						</Card.Body>
					</Card>

					<Card>
						<Card.Header>
							<Text className='text-lg font-bold text-foreground'>Заказы</Text>
						</Card.Header>
						<Card.Body className='mt-4 p-0'>
							<View className='mt-3 gap-3'>
								{data.orders.length === 0 ? (
									<Text className='text-base text-muted'>Заказов пока нет</Text>
								) : (
									data.orders.map((order) => (
										<OrderListItem key={order.id} order={order} />
									))
								)}
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

function OrderListItem({ order }: { order: IOrder }) {
	const totalItemsCount = order.items.reduce(
		(total, item) => total + item.quantity,
		0,
	)

	const statusLabel = order.status === 'completed' ? 'Завершен' : 'В работе'
	const statusColor = order.status === 'completed' ? 'success' : 'warning'

	return (
		<View className='rounded-2xl border border-border bg-background-secondary p-3'>
			<View className='flex-row items-start justify-between gap-3'>
				<View className='gap-1'>
					<Text className='text-base font-semibold text-foreground'>
						Заказ #{order.id}
					</Text>
					<Text className='text-sm text-muted'>{order.date}</Text>
				</View>
				<Chip variant='soft' color={statusColor}>
					{statusLabel}
				</Chip>
			</View>

			<Text className='mt-3 text-sm text-foreground'>
				Позиций: {totalItemsCount}
			</Text>
			<Text className='mt-1 text-sm text-foreground'>
				Сумма: {order.total} ₽
			</Text>
		</View>
	)
}
