import HomePage from '@/components/pages/home/home-page'
import { useActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode-context'
import { useRecordGetMyClientsMany } from '@/hooks/actions/record/use-record-get-my-clients-many'
import { useRecordGetMyMany } from '@/hooks/actions/record/use-record-get-my-many'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function GeneralScreen(): ReactElement {
	const { mode } = useActiveProfileMode()
	const isMasterMode = mode === 'master'
	const masterRecordsQuery = useRecordGetMyClientsMany({
		enabled: isMasterMode,
	})
	const clientRecordsQuery = useRecordGetMyMany({
		enabled: !isMasterMode,
	})

	const activeQuery = isMasterMode ? masterRecordsQuery : clientRecordsQuery
	const { data, isLoading, error } = activeQuery

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (error?.message) {
		return <Text>Ошибка: {error.message}</Text>
	}

	return <HomePage mode={mode} records={data ?? []} />
}
