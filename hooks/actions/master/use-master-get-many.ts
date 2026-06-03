import { masterProfilesGetMany } from '@/actions/master/actions'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterGetMany = () => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IMasterProfile[]>({
		queryKey: ['master-profiles', 'many'],
		queryFn: async () => {
			const res = await masterProfilesGetMany()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки мастеров',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? []
		},
	})

	return { data, isLoading, error }
}
