import { z } from 'zod'

export const LoginSchema = z.object({
	email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Неверный email'),
	password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
	fingerprint: z.string().optional(),
})

export type ILogin = z.infer<typeof LoginSchema>
