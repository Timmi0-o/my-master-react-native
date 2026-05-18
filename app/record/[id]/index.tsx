import RecordDetail from '@/components/pages/record/record-detail/record-detail'
import { useRecordGetOne } from '@/hooks/actions/record/use-record-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

export default function RecordScreen(): ReactElement {
	const { id } = useLocalSearchParams<{ id: string }>()
	const recordId = Array.isArray(id) ? id[0] : id
	const { data, isLoading, error } = useRecordGetOne(recordId ?? '')

	if (isLoading) {
		return <Text>Загрузка...</Text>
	}

	if (error?.message) {
		return <Text>Ошибка: {error.message}</Text>
	}

	if (!data) {
		return <Text>Запись не найдена</Text>
	}

	return <RecordDetail record={data} />
}
