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
