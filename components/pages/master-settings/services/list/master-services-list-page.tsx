import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePageLoaderListBody } from '@/components/shared/components/base-page-loader/base-page-loader'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceDelete } from '@/hooks/actions/master-service/use-master-service-delete'
import { useMasterServiceGetMyMany } from '@/hooks/actions/master-service/use-master-service-get-my-many'
import { useRouter } from 'expo-router'
import { useState, type ReactElement } from 'react'
import { View } from 'react-native'
import { MasterServicesListHeader } from './components/master-services-list-header'
import { ServiceListItemRow } from './components/service-list-item-row/service-list-item-row'

interface IMasterServicesListPageProps {
	masterProfile: IMasterProfile
}

export function MasterServicesListPage({
	masterProfile: _masterProfile,
}: IMasterServicesListPageProps): ReactElement {
	const router = useRouter()

	const [isEditMode, setIsEditMode] = useState(false)

	const { t } = useScopedTranslation('pages', 'masterSettings')

	const {
		data = [],
		isLoading,
		refetch,
	} = useMasterServiceGetMyMany({
		orderField: 'createdAt',
		orderDir: 'desc',
	})
	const deleteMutation = useMasterServiceDelete()

	return (
		<BasePage>
			<MasterServicesListHeader
				isEditMode={isEditMode}
				onAddPress={() => router.push('/master-settings/services/create')}
				onEditModeChange={setIsEditMode}
				onEditSubmit={() => {
					setIsEditMode(false)
				}}
				title={t('myServices')}
			/>

			{isLoading ? (
				<BasePageLoaderListBody itemCount={3} />
			) : (
				<View
					onTouchStart={() => {
						setIsEditMode(false)
					}}
					style={{
						rowGap: 12,
						paddingBottom: 24,
						paddingHorizontal: 6,
						flex: 1,
					}}
				>
					{data.map((item) => (
						<ServiceListItemRow
							key={item.id}
							service={item}
							isEditMode={isEditMode}
							onEdit={() => {
								router.push({
									pathname: '/master-settings/services/edit',
									params: { id: item.id },
								})
							}}
							onDelete={() => {
								deleteMutation.deleteService(item.id, () => {
									setIsEditMode(false)
									refetch()
								})
							}}
						/>
					))}
					{!data.length ? <DataNotFound message={t('emptyServices')} /> : null}
				</View>
			)}
		</BasePage>
	)
}
