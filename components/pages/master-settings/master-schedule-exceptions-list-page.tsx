import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { EXCEPTION_KIND_LABELS } from '@/constants/master-schedule.constants'
import { useMasterScheduleExceptionDelete } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-delete'
import { useMasterScheduleExceptionGetMany } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-get-many'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterScheduleExceptionsListPageProps {
	masterProfile: IMasterProfile
}

export function MasterScheduleExceptionsListPage({
	masterProfile,
}: IMasterScheduleExceptionsListPageProps): ReactElement {
	const router = useRouter()
	const { data = [], isLoading } = useMasterScheduleExceptionGetMany(
		masterProfile.id,
	)
	const deleteMutation = useMasterScheduleExceptionDelete(masterProfile.id)

	return (
		<BasePage>
			<ScheduleScreenHeader title='Выходные и исключения' />

			<Button
				className='mb-4'
				variant='primary'
				onPress={() =>
					router.push('/master-settings/schedule-exceptions/edit')
				}
			>
				<Button.Label>Добавить исключение</Button.Label>
			</Button>

			{isLoading ? (
				<Text className='text-muted'>Загрузка...</Text>
			) : (
				<View style={{ rowGap: 12 }}>
					{data.map((item) => (
						<Card key={item.id}>
							<Card.Body className='gap-2'>
								<Text className='font-semibold text-foreground'>
									{item.title ?? EXCEPTION_KIND_LABELS[item.kind]}
								</Text>
								<Chip color='default'>{EXCEPTION_KIND_LABELS[item.kind]}</Chip>
								<Text className='text-sm text-muted'>
									{new Date(item.startsAt).toLocaleString('ru-RU')} —{' '}
									{new Date(item.endsAt).toLocaleString('ru-RU')}
								</Text>
								{item.kind === 'CUSTOM_HOURS' &&
								item.customStartTime &&
								item.customEndTime ? (
									<Text className='text-sm text-muted'>
										Часы: {item.customStartTime} – {item.customEndTime}
									</Text>
								) : null}
								<View className='flex-row gap-2'>
									<Button
										size='sm'
										variant='outline'
										onPress={() =>
											router.push({
												pathname:
													'/master-settings/schedule-exceptions/edit',
												params: { id: item.id },
											})
										}
									>
										<Button.Label>Изменить</Button.Label>
									</Button>
									<Button
										size='sm'
										variant='danger'
										onPress={() => void deleteMutation.mutateAsync(item.id)}
										isDisabled={deleteMutation.isPending}
									>
										<Button.Label>Удалить</Button.Label>
									</Button>
								</View>
							</Card.Body>
						</Card>
					))}
					{!data.length ? (
						<Text className='text-center text-muted'>
							Нет исключений. Добавьте выходной или отпуск.
						</Text>
					) : null}
				</View>
			)}
		</BasePage>
	)
}
