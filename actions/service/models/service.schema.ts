import { z } from 'zod'
import { MasterServiceSchema } from '@/actions/master-service/models/master-service.schema'

export const RecommendedServiceSchema = MasterServiceSchema

export type IRecommendedService = z.infer<typeof RecommendedServiceSchema>
