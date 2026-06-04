import { z } from 'zod'

export const AvailableSlotSchema = z.object({
	startsAt: z.string(),
})

export const MasterServiceAvailableSlotsSchema = z.object({
	date: z.string(),
	timezone: z.string(),
	slots: z.array(AvailableSlotSchema),
})

export type IAvailableSlot = z.infer<typeof AvailableSlotSchema>
export type IMasterServiceAvailableSlots = z.infer<
	typeof MasterServiceAvailableSlotsSchema
>
