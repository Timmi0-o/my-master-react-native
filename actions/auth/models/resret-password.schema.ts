import { z } from 'zod'

export const ResetPasswordRequestSchema = z.object({
	email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Неверный email'),
})

export const SetNewPasswordSchema = z
	.object({
		password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
		confirmPassword: z.string().min(1, 'Подтвердите пароль'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export type IResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>
export type ISetNewPassword = z.infer<typeof SetNewPasswordSchema> & {
	token: string
}
