import { appointmentsGetMyClientsMany } from '@/actions/appointment/actions'
import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useAppointmentGetMyClientsMany = (options?: {
	enabled?: boolean
}) => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IAppointment[]>({
		queryKey: ['appointments', 'my-clients'],
		enabled: options?.enabled ?? true,
		queryFn: async () => {
			const res = await appointmentsGetMyClientsMany({
				filters: {
					preset: 'BASE',
					limit: 50,
					orderField: 'startsAt',
					orderDir: 'desc',
				},
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки чатов',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error }
}
