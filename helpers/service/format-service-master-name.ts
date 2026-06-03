import type { IMasterService } from '@/actions/master-service/models/master-service.schema'

export const formatServiceMasterName = (
	masterProfile: NonNullable<IMasterService['masterProfile']>,
): string => masterProfile.displayName
