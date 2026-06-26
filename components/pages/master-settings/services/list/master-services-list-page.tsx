import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { useMasterServiceDelete } from '@/hooks/actions/master-service/use-master-service-delete'
import { useMasterServiceGetMyMany } from '@/hooks/actions/master-service/use-master-service-get-my-many'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Button, Card, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { ScheduleScreenHeader } from '../../components/schedule-screen-header'

interface IMasterServicesListPageProps {
	masterProfile: IMasterProfile
}

function ServiceListItem({
	service,
	onEdit,
	onDelete,
}: {
	service: IMasterService
	onEdit: () => void
	onDelete: () => void
}): ReactElement {
	const mutedColor = useThemeColor('muted')
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tUi } = useScopedTranslation('ui')

	return (
		<Card>
			<Card.Body className='gap-2'>
				<Pressable onPress={onEdit} className='gap-1'>
					<Text className='text-base font-semibold text-foreground'>
						{service.name}
					</Text>
					<Text className='text-sm text-muted' numberOfLines={2}>
						{service.description}
					</Text>
					<Text className='text-sm text-foreground'>
						{formatPriceByCurrency(service.price, ECurrency.RUB)} ·{' '}
						{tUi('durationMinutes', { count: service.durationMinutes ?? 0 })}
					</Text>
				</Pressable>
				<View className='flex-row justify-end gap-2'>
					<Button size='sm' variant='secondary' onPress={onEdit}>
						<Ionicons name='create-outline' size={16} color={mutedColor} />
					</Button>
					<Button size='sm' variant='danger' onPress={onDelete}>
						<Ionicons name='trash-outline' size={16} color='white' />
					</Button>
				</View>
			</Card.Body>
		</Card>
	)
}

export function MasterServicesListPage({
	masterProfile: _masterProfile,
}: IMasterServicesListPageProps): ReactElement {
	const router = useRouter()
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tCommon } = useScopedTranslation('common')
	const { data = [], isLoading, refetch } = useMasterServiceGetMyMany({
		orderField: 'createdAt',
		orderDir: 'desc',
	})
	const deleteMutation = useMasterServiceDelete()

	return (
		<BasePage>
			<ScheduleScreenHeader title={t('myServices')} />

			{isLoading ? (
				<Text className='text-muted'>{tCommon('loading')}</Text>
			) : !data.length ? (
				<DataNotFound message={t('emptyServices')} />
			) : (
				<FlatList
					data={data}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
					renderItem={({ item }) => (
						<ServiceListItem
							service={item}
							onEdit={() =>
								router.push({
									pathname: '/master-settings/services/edit',
									params: { id: item.id },
								})
							}
							onDelete={() => {
								deleteMutation.mutate(item.id, {
									onSuccess: () => void refetch(),
								})
							}}
						/>
					)}
				/>
			)}
		</BasePage>
	)
}
