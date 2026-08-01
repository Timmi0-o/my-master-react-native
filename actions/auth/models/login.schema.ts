import { scopedT } from '@/configs/i18n/scoped-t'
import { z } from 'zod'

export const createLoginSchema = () =>
	z.object({
		email: z
			.string()
			.min(1, scopedT('emailRequired', 'common', 'validation.auth'))
			.email(scopedT('emailInvalid', 'common', 'validation.auth')),
		password: z
			.string()
			.min(8, scopedT('passwordMin', 'common', 'validation.auth')),
	})

export type ILogin = z.infer<ReturnType<typeof createLoginSchema>>

/** @deprecated Use createLoginSchema() for localized messages */
export const LoginSchema = createLoginSchema()

export const createRegisterSchema = () =>
	z.object({
		email: z
			.string()
			.min(1, scopedT('emailRequired', 'common', 'validation.auth'))
			.email(scopedT('emailInvalid', 'common', 'validation.auth')),
		username: z
			.string()
			.min(3, scopedT('usernameMin', 'common', 'validation.auth'))
			.max(32, scopedT('usernameMax', 'common', 'validation.auth'))
			.regex(/^[a-zA-Z0-9_]+$/, scopedT('usernameInvalid', 'common', 'validation.auth')),
		password: z
			.string()
			.min(8, scopedT('passwordMin', 'common', 'validation.auth')),
		language: z
			.enum(['RU', 'EN', 'ES', 'ZH', 'AR', 'FR', 'DE', 'PT', 'JA', 'HI'])
			.optional(),
	})

export type IRegister = z.infer<ReturnType<typeof createRegisterSchema>>
