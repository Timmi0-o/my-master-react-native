import HomePage from '@/components/pages/home/home-page'
import { useRecordGetMyClientsMany } from '@/hooks/actions/record/use-record-get-my-clients-many'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function GeneralScreen(): ReactElement {
	const { data, isLoading, error } = useRecordGetMyClientsMany()

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (error?.message) {
		return <Text>Ошибка: {error.message}</Text>
	}

	return <HomePage records={data ?? []} />
}
