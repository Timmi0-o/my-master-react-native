import { z } from 'zod'

export const MasterScheduleExceptionKindSchema = z.enum([
	'CLOSED',
	'CUSTOM_HOURS',
])
