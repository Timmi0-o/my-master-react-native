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

export const MasterServiceEditSchema = z
	.object({
		id: z.string(),
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
	.transform(({ id: _id, ...data }) => ({
		name: data.name.trim(),
		description: data.description.trim(),
		price: Number(data.price.trim()),
		durationMinutes: Number(data.durationMinutes.trim()),
	}))

export type IMasterServiceEdit = z.input<typeof MasterServiceEditSchema>
export type IMasterServiceEditPayload = z.output<typeof MasterServiceEditSchema>
