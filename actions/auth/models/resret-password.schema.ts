import { scopedT } from '@/configs/i18n/scoped-t'
import { z } from 'zod'

export const createResetPasswordRequestSchema = () =>
	z.object({
		email: z
			.string()
			.regex(
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				scopedT('emailRegex', 'common', 'validation.auth'),
			),
	})

export const createSetNewPasswordSchema = () =>
	z
		.object({
			password: z
				.string()
				.min(8, scopedT('passwordMin', 'common', 'validation.auth')),
			confirmPassword: z
				.string()
				.min(1, scopedT('confirmPasswordRequired', 'common', 'validation.auth')),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: scopedT('passwordsMismatch', 'common', 'validation.auth'),
			path: ['confirmPassword'],
		})

export type IResetPasswordRequest = z.infer<
	ReturnType<typeof createResetPasswordRequestSchema>
>
export type ISetNewPassword = z.infer<
	ReturnType<typeof createSetNewPasswordSchema>
> & {
	token: string
}

/** @deprecated Use create* factories for localized messages */
export const ResetPasswordRequestSchema = createResetPasswordRequestSchema()
export const SetNewPasswordSchema = createSetNewPasswordSchema()
