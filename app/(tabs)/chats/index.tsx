import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { ChatsPage } from '@/components/pages/chats/chats-page/chats-page'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useAppointmentGetMyClientsMany } from '@/hooks/actions/appointment/use-appointment-get-my-clients-many'
import { useAppointmentGetMyMany } from '@/hooks/actions/appointment/use-appointment-get-my-many'
import { getAppointmentsWithChat } from '@/utils/appointment.util'
import type { ReactElement } from 'react'
import { useCallback, useMemo } from 'react'
import { Text } from 'react-native'

export default function Chats(): ReactElement {
	const { mode } = useActiveProfileMode()
	const isMasterMode = mode === 'master'

	const myClientsQuery = useAppointmentGetMyClientsMany({
		enabled: isMasterMode,
	})
	const myQuery = useAppointmentGetMyMany({
		enabled: !isMasterMode,
	})

	const activeQuery = isMasterMode ? myClientsQuery : myQuery

	const chats = useMemo((): IAppointment[] => {
		return getAppointmentsWithChat(activeQuery.data ?? [])
	}, [activeQuery.data])

	const handleRefresh = useCallback(() => {
		void activeQuery.refetch()
	}, [activeQuery.refetch])

	if (activeQuery.error?.message) {
		return <Text>{routeErrorText(activeQuery.error.message)}</Text>
	}

	return (
		<ChatsPage
			mode={mode}
			chats={chats}
			isLoading={activeQuery.isLoading}
			isRefreshing={activeQuery.isRefetching}
			onRefresh={handleRefresh}
		/>
	)
}
