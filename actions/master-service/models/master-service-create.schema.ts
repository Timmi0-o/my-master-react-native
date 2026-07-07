import { scopedT } from '@/configs/i18n/scoped-t'
import { z } from 'zod'

const priceField = z.string().refine((value) => {
	const trimmed = value.trim()

	if (!/^\d+(\.\d+)?$/.test(trimmed)) {
		return false
	}

	return Number(trimmed) >= 0
}, scopedT('priceInvalid', 'common', 'validation.masterService'))

const durationField = z.string().refine((value) => {
	const trimmed = value.trim()

	if (!/^\d+$/.test(trimmed)) {
		return false
	}

	const parsed = Number(trimmed)

	return Number.isInteger(parsed) && parsed >= 1 && parsed <= 1440
}, scopedT('durationInvalid', 'common', 'validation.masterService'))

export const MasterServiceCreateSchema = z
	.object({
		masterProfileId: z.string().min(1),
		name: z
			.string()
			.trim()
			.min(1, scopedT('nameRequired', 'common', 'validation.masterService'))
			.max(255, scopedT('nameTooLong', 'common', 'validation.masterService')),
		description: z
			.string()
			.trim()
			.min(
				1,
				scopedT('descriptionRequired', 'common', 'validation.masterService'),
			)
			.max(
				5000,
				scopedT('descriptionTooLong', 'common', 'validation.masterService'),
			),
		price: priceField,
		durationMinutes: durationField,
	})
	.transform((data) => ({
		masterProfileId: data.masterProfileId,
		name: data.name.trim(),
		description: data.description.trim(),
		price: Number(data.price.trim()),
		durationMinutes: Number(data.durationMinutes.trim()),
	}))

export type IMasterServiceCreate = z.input<typeof MasterServiceCreateSchema>
export type IMasterServiceCreatePayload = z.output<
	typeof MasterServiceCreateSchema
>
