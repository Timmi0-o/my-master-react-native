import { appointmentsGetOne } from '@/actions/appointment/actions'
import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useAppointmentGetOne = (appointmentId: string) => {
	const { toast } = useToast()

	return useQuery<IAppointment | null>({
		queryKey: ['appointments', 'one', appointmentId],
		enabled: appointmentId.length > 0,
		queryFn: async () => {
			const res = await appointmentsGetOne(appointmentId, {
				filters: { preset: 'BASE' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadOneFailed', 'common', 'toasts.appointment'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? null
		},
	})
}
