import { masterProfilesGetMany } from '@/actions/master/actions'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { formatQueryGetMasterProfiles } from '@/helpers/format-query-object/format-query-get-master-profiles'
import { useManageSearchParams } from '@/hooks/use-manage-search-params'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterGetMany = () => {
	const { toast } = useToast()

	const { searchParams, searchParamsQuery } = useManageSearchParams()

	const { data, isLoading, error } = useQuery<IMasterProfile[]>({
		queryKey: ['master-profiles', 'many', searchParamsQuery],
		queryFn: async () => {
			const res = await masterProfilesGetMany({
				filters: {
					preset: 'BASE',
					...formatQueryGetMasterProfiles(searchParams),
					limit: 15,
					orderField: 'rating',
					orderDir: 'desc',
				},
			})

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
