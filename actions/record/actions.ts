import { IActionResponse } from '@/types/i-action.types'
import { IRecord } from './models/record.schema'

const MOCK_RECORDS: IRecord[] = [
	{
		id: '1',
		name: 'Стрижка и укладка',
		date: '2026-05-20',
		time: '10:00',
		service: {
			id: '1',
			name: 'Стрижка',
		},
		client: {
			id: '1',
			name: 'Анна Иванова',
			phone: '+79991234567',
			email: 'anna@example.com',
		},
	},
	{
		id: '2',
		name: 'Маникюр',
		date: '2026-05-21',
		time: '11:30',
		service: {
			id: '2',
			name: 'Маникюр',
		},
		client: {
			id: '2',
			name: 'Мария Петрова',
			phone: '+79991234568',
			email: 'maria@example.com',
		},
	},
	{
		id: '3',
		name: 'Окрашивание',
		date: '2026-05-22',
		time: '14:00',
		service: {
			id: '3',
			name: 'Окрашивание',
		},
		client: {
			id: '3',
			name: 'Елена Смирнова',
			phone: '+79991234569',
			email: 'elena@example.com',
		},
	},
	{
		id: '4',
		name: 'Консультация',
		date: '2026-05-23',
		time: '16:00',
		service: {
			id: '4',
			name: 'Консультация',
		},
		client: {
			id: '4',
			name: 'Ольга Козлова',
			phone: '+79991234570',
			email: 'olga@example.com',
		},
	},
]

export const recordGetMyClientsMany = async (): Promise<
	IActionResponse<IRecord[]>
> => {
	return Promise.resolve({
		result: {
			data: MOCK_RECORDS,
		},
	})
}

export const recordGetOne = async (
	recordId: string,
): Promise<IActionResponse<IRecord>> => {
	const record = MOCK_RECORDS.find((item) => item.id === recordId)

	if (!record) {
		return Promise.resolve({
			error: {
				statusCode: 404,
				timestamp: new Date().toISOString(),
				error: 'Not Found',
				message: 'Запись не найдена',
			},
			result: {
				data: null as unknown as IRecord,
			},
		})
	}

	return Promise.resolve({
		result: {
			data: record,
		},
	})
}
