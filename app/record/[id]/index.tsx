import RecordDetail from '@/components/pages/record/record-detail/record-detail'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import {
	routeErrorText,
	routeLoadingText,
} from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useAppointmentGetOne } from '@/hooks/actions/appointment/use-appointment-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function RecordScreen(): ReactElement {
	const { mode } = useActiveProfileMode()
	const { t } = useScopedTranslation('pages', 'record')
	const { id } = useLocalSearchParams<{ id: string }>()
	const appointmentId = Array.isArray(id) ? id[0] : id
	const { data, isLoading, error } = useAppointmentGetOne(appointmentId ?? '')

	if (isLoading) {
		return <Text>{routeLoadingText()}</Text>
	}

	if (error?.message) {
		return <Text>{routeErrorText(error.message)}</Text>
	}

	if (!data) {
		return <Text>{t('notFound')}</Text>
	}

	return <RecordDetail appointment={data} mode={mode} />
}
