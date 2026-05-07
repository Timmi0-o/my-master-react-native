import { z } from 'zod'

export const OrderItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	quantity: z.number(),
	price: z.number(),
})

export const OrderSchema = z.object({
	id: z.string(),
	date: z.string(),
	total: z.number(),
	status: z.string(),
	items: z.array(OrderItemSchema),
})

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	surName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	rating: z.number(),
	reviewsCount: z.number(),
	email: z.string(),
	orders: z.array(OrderSchema),
})

export type IUser = z.infer<typeof UserSchema>
export type IOrder = z.infer<typeof OrderSchema>
export type IOrderItem = z.infer<typeof OrderItemSchema>
