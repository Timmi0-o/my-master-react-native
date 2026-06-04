import { appointmentsCreate } from '@/actions/appointment/actions'
import type { IAppointmentCreatePayload } from '@/actions/appointment/models/appointment-create-payload.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useAppointmentCreate = () => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IAppointmentCreatePayload) => {
			const res = await appointmentsCreate(payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('createFailed', 'common', 'toasts.appointment'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['appointments', 'my'],
			})
			toast.show({
				variant: 'success',
				label: scopedT('created', 'common', 'toasts.appointment'),
				description: scopedT('createdDescription', 'common', 'toasts.appointment'),
			})
		},
	})
}
