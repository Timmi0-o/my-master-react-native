import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { ChatsPage } from '@/components/pages/chats/chats-page'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useAppointmentGetMyClientsMany } from '@/hooks/actions/appointment/use-appointment-get-my-clients-many'
import { useAppointmentGetMyMany } from '@/hooks/actions/appointment/use-appointment-get-my-many'
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
		const items = (activeQuery.data ?? []).filter(
			(appointment) => appointment.chat != null,
		)

		return [...items].sort((left, right) => {
			const leftMessages = left.chat?.messages ?? []
			const rightMessages = right.chat?.messages ?? []
			const leftLast = leftMessages.length
				? [...leftMessages].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime(),
					)[0]
				: null
			const rightLast = rightMessages.length
				? [...rightMessages].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime(),
					)[0]
				: null
			const leftTime = leftLast
				? new Date(leftLast.createdAt).getTime()
				: new Date(left.startsAt).getTime()
			const rightTime = rightLast
				? new Date(rightLast.createdAt).getTime()
				: new Date(right.startsAt).getTime()

			return rightTime - leftTime
		})
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
