import { masterServicesCreate } from '@/actions/master-service/actions'
import type { IMasterServiceCreatePayload } from '@/actions/master-service/models/master-service-create.schema'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterServiceCreate = () => {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	return useMutation({
		mutationFn: async (payload: IMasterServiceCreatePayload) => {
			const res = await masterServicesCreate(payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('saveFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data as IMasterService | null
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['master-services'] })
			toast.show({
				variant: 'success',
				label: scopedT('saved', 'common', 'toasts.masterService'),
			})
		},
	})
}
