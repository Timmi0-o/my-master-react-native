import { masterServicesGetMany } from '@/actions/master-service/actions'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterServiceGetMany = () => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IMasterService[]>({
		queryKey: ['master-services', 'many', 'recommended'],
		queryFn: async () => {
			const res = await masterServicesGetMany({
				filters: {
					preset: 'BASE',
					limit: 15,
					orderField: 'price',
					orderDir: 'desc',
				},
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadManyFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error }
}
