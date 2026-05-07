import { IActionResponse } from '@/types/i-action.types'
import { IUser } from './models/user.schema'

export const userGetOne = async (): Promise<IActionResponse<IUser>> => {
	return Promise.resolve({
		result: {
			data: {
				id: '1',
				name: 'Timmy',
				email: 'timmy@example.com',
				surName: 'Doe',
				lastName: 'John',
				phone: '+79991234567',
				rating: 4.5,
				reviewsCount: 10,
				orders: [
					{
						id: '1',
						date: '2026-01-01',
						total: 100,
						status: 'pending',
						items: [
							{
								id: '1',
								name: 'Item 1',
								quantity: 1,
								price: 100,
							},
						],
					},
					{
						id: '2',
						date: '2026-01-02',
						total: 200,
						status: 'completed',
						items: [
							{
								id: '2',
								name: 'Item 2',
								quantity: 2,
								price: 200,
							},
						],
					},
				],
			},
		},
	})
}
