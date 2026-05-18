import { IActionResponse } from '@/types/i-action.types'
import { IMaster } from './models/master.schema'

const MOCK_MASTERS: IMaster[] = [
	{
		id: '1',
		name: 'Анна Иванова',
		rating: 4.9,
		reviewsCount: 128,
		services: [
			{ id: '1', name: 'Стрижка' },
			{ id: '2', name: 'Окрашивание' },
			{ id: '3', name: 'Укладка' },
		],
	},
	{
		id: '2',
		name: 'Мария Петрова',
		rating: 4.7,
		reviewsCount: 94,
		services: [
			{ id: '4', name: 'Маникюр' },
			{ id: '5', name: 'Педикюр' },
		],
	},
	{
		id: '3',
		name: 'Елена Смирнова',
		rating: 4.8,
		reviewsCount: 76,
		services: [
			{ id: '6', name: 'Макияж' },
			{ id: '7', name: 'Брови' },
			{ id: '8', name: 'Ресницы' },
		],
	},
	{
		id: '4',
		name: 'Ольга Козлова',
		rating: 4.6,
		reviewsCount: 52,
		services: [
			{ id: '9', name: 'Массаж' },
			{ id: '10', name: 'СПА-уход' },
		],
	},
]

export const masterGetMany = async (): Promise<IActionResponse<IMaster[]>> => {
	return Promise.resolve({
		result: {
			data: MOCK_MASTERS,
		},
	})
}
