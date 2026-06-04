import { masterServicesGetAvailableSlots } from '@/actions/master-service/actions'
import type { IMasterServiceAvailableSlots } from '@/actions/master-service/models/master-service-available-slots.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterServiceGetAvailableSlots = (
	masterServiceId: string,
	date: string,
	enabled = true,
) => {
	const { toast } = useToast()

	return useQuery<IMasterServiceAvailableSlots | null>({
		queryKey: ['master-services', 'available-slots', masterServiceId, date],
		enabled: enabled && masterServiceId.length > 0 && date.length > 0,
		queryFn: async () => {
			const res = await masterServicesGetAvailableSlots(masterServiceId, {
				date,
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('slotsLoadFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
