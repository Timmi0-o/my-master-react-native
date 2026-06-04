import { scopedT } from '@/configs/i18n/scoped-t'
import { z } from 'zod'

export const createHhMmTimeSchema = () =>
	z
		.string()
		.regex(
			/^([01]\d|2[0-3]):[0-5]\d$/,
			scopedT('hhMmFormat', 'common', 'validation.time'),
		)

export const HhMmTimeSchema = createHhMmTimeSchema()
