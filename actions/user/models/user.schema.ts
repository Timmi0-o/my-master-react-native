import { z } from 'zod'

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	surName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	rating: z.number(),
	reviewsCount: z.number(),
	email: z.string(),
})

export type IUser = z.infer<typeof UserSchema>
