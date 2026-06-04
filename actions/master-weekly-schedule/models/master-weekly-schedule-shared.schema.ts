import { z } from 'zod'

export const DayOfWeekSchema = z.enum([
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY',
])
