import { z } from 'zod'

export const GetActionPresetSchema = z.enum(['MINIMAL', 'SHORT', 'BASE'])

export type IGetActionPresets = z.infer<typeof GetActionPresetSchema>

export const PresetFieldSchema = GetActionPresetSchema.optional()

export type IPresetField = z.infer<typeof PresetFieldSchema>
