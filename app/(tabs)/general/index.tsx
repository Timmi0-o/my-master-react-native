import HomePage from '@/components/pages/home/home-page'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useAppointmentGetMyClientsMany } from '@/hooks/actions/appointment/use-appointment-get-my-clients-many'
import { useAppointmentGetMyMany } from '@/hooks/actions/appointment/use-appointment-get-my-many'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function GeneralScreen(): ReactElement {
	const { mode } = useActiveProfileMode()
	const isMasterMode = mode === 'master'
	const masterAppointmentsQuery = useAppointmentGetMyClientsMany({
		enabled: isMasterMode,
	})
	const clientAppointmentsQuery = useAppointmentGetMyMany({
		enabled: !isMasterMode,
	})

	const activeQuery = isMasterMode
		? masterAppointmentsQuery
		: clientAppointmentsQuery
	const { data, isLoading, error } = activeQuery

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (error?.message) {
		return <Text>Ошибка: {error.message}</Text>
	}

	return <HomePage mode={mode} appointments={data ?? []} />
}
