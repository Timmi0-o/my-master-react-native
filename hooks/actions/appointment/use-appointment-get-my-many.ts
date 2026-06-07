import { appointmentsGetMyMany } from '@/actions/appointment/actions'
import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useAppointmentGetMyMany = (options?: { enabled?: boolean }) => {
	const { toast } = useToast()

	const { data, isLoading, error, refetch, isRefetching } = useQuery<
		IAppointment[]
	>({
		queryKey: ['appointments', 'my'],
		enabled: options?.enabled ?? true,
		queryFn: async () => {
			const res = await appointmentsGetMyMany({
				filters: {
					preset: 'BASE',
					limit: 50,
					orderField: 'createdAt',
					orderDir: 'desc',
				},
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadManyFailed', 'common', 'toasts.appointment'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error, refetch, isRefetching }
}
