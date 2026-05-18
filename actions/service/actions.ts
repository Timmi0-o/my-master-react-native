import { IActionResponse } from '@/types/i-action.types'
import { IRecommendedService } from './models/service.schema'

const MOCK_RECOMMENDED_SERVICES: IRecommendedService[] = [
	{
		id: '1',
		name: 'Стрижка',
		master: {
			id: '1',
			surname: 'Иванова',
			name: 'Анна',
			patronymic: 'Петровна',
			rating: 4.9,
		},
	},
	{
		id: '2',
		name: 'Окрашивание',
		master: {
			id: '1',
			surname: 'Иванова',
			name: 'Анна',
			patronymic: 'Петровна',
			rating: 4.9,
		},
	},
	{
		id: '4',
		name: 'Маникюр',
		master: {
			id: '2',
			surname: 'Петрова',
			name: 'Мария',
			patronymic: 'Сергеевна',
			rating: 4.7,
		},
	},
	{
		id: '6',
		name: 'Макияж',
		master: {
			id: '3',
			surname: 'Смирнова',
			name: 'Елена',
			patronymic: 'Андреевна',
			rating: 4.8,
		},
	},
	{
		id: '9',
		name: 'Массаж',
		master: {
			id: '4',
			surname: 'Козлова',
			name: 'Ольга',
			patronymic: 'Игоревна',
			rating: 4.6,
		},
	},
	{
		id: '3',
		name: 'Укладка',
		master: {
			id: '1',
			surname: 'Иванова',
			name: 'Анна',
			patronymic: 'Петровна',
			rating: 4.9,
		},
	},
	{
		id: '5',
		name: 'Педикюр',
		master: {
			id: '2',
			surname: 'Петрова',
			name: 'Мария',
			patronymic: 'Сергеевна',
			rating: 4.7,
		},
	},
	{
		id: '7',
		name: 'Брови',
		master: {
			id: '3',
			surname: 'Смирнова',
			name: 'Елена',
			patronymic: 'Андреевна',
			rating: 4.8,
		},
	},
	{
		id: '8',
		name: 'Ресницы',
		master: {
			id: '3',
			surname: 'Смирнова',
			name: 'Елена',
			patronymic: 'Андреевна',
			rating: 4.8,
		},
	},
	{
		id: '10',
		name: 'СПА-уход',
		master: {
			id: '4',
			surname: 'Козлова',
			name: 'Ольга',
			patronymic: 'Игоревна',
			rating: 4.6,
		},
	},
	{
		id: '11',
		name: 'Кератиновое выпрямление',
		master: {
			id: '1',
			surname: 'Иванова',
			name: 'Анна',
			patronymic: 'Петровна',
			rating: 4.9,
		},
	},
	{
		id: '12',
		name: 'Гель-лак',
		master: {
			id: '2',
			surname: 'Петрова',
			name: 'Мария',
			patronymic: 'Сергеевна',
			rating: 4.7,
		},
	},
]

export const serviceGetRecommendedForYou = async (): Promise<
	IActionResponse<IRecommendedService[]>
> => {
	return Promise.resolve({
		result: {
			data: MOCK_RECOMMENDED_SERVICES,
		},
	})
}
