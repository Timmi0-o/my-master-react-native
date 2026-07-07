import RecordDetail from '@/components/pages/record/record-detail/record-detail'
import { BasePageLoader } from '@/components/shared/components/base-page-loader/base-page-loader'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useAppointmentGetOne } from '@/hooks/actions/appointment/use-appointment-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { View } from 'react-native'

export default function RecordScreen(): ReactElement {
	const { mode } = useActiveProfileMode()
	const { t } = useScopedTranslation('pages', 'record')
	const { id } = useLocalSearchParams<{ id: string }>()
	const appointmentId = Array.isArray(id) ? id[0] : id
	const { data, isLoading, error } = useAppointmentGetOne(appointmentId ?? '')

	if (isLoading) {
		return <BasePageLoader />
	}

	if (error?.message) {
		return (
			<View className='flex-1 bg-background'>
				<DataNotFound message={routeErrorText(error.message)} />
			</View>
		)
	}

	if (!data) {
		return (
			<View className='flex-1 bg-background'>
				<DataNotFound message={t('notFound')} />
			</View>
		)
	}

	return <RecordDetail appointment={data} mode={mode} />
}
