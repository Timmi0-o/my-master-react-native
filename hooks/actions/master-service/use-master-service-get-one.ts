import { masterServicesGetOne } from '@/actions/master-service/actions'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterServiceGetOne = (masterServiceId: string) => {
	const { toast } = useToast()

	return useQuery<IMasterService | null>({
		queryKey: ['master-services', 'one', masterServiceId],
		enabled: masterServiceId.length > 0,
		queryFn: async () => {
			const res = await masterServicesGetOne(masterServiceId, {
				filters: { preset: 'BASE' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadOneFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
