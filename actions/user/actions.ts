import { IActionResponse } from '@/types/i-action.types'
import { IUser } from './models/user.schema'

export const userGetOne = async (): Promise<IActionResponse<IUser>> => {
	return Promise.resolve({
		result: {
			data: {
				id: '1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				surName: 'Doe',
				lastName: 'John',
				phone: '+79991234567',
				rating: 4.5,
				reviewsCount: 10,
			},
		},
	})
}
