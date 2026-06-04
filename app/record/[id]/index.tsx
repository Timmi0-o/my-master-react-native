import RecordDetail from '@/components/pages/record/record-detail/record-detail'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useAppointmentGetOne } from '@/hooks/actions/appointment/use-appointment-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function RecordScreen(): ReactElement {
	const { mode } = useActiveProfileMode()
	const { id } = useLocalSearchParams<{ id: string }>()
	const appointmentId = Array.isArray(id) ? id[0] : id
	const { data, isLoading, error } = useAppointmentGetOne(appointmentId ?? '')

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (error?.message) {
		return <Text>Ошибка: {error.message}</Text>
	}

	if (!data) {
		return <Text>Запись не найдена</Text>
	}

	return <RecordDetail appointment={data} mode={mode} />
}
