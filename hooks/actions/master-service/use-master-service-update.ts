import { masterServicesUpdate } from '@/actions/master-service/actions'
import type { IMasterServiceEditPayload } from '@/actions/master-service/models/master-service-edit.schema'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterServiceUpdate = (serviceId: string) => {
	const queryClient = useQueryClient()
	const { toast } = useToast()

	return useMutation({
		mutationFn: async (payload: IMasterServiceEditPayload) => {
			const res = await masterServicesUpdate(serviceId, payload)

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
