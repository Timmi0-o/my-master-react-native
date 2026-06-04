import { masterProfilesGetOne } from '@/actions/master/actions'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterProfileGetOne = (masterProfileId: string) => {
	const { toast } = useToast()

	return useQuery<IMasterProfile | null>({
		queryKey: ['master-profiles', 'one', masterProfileId],
		enabled: masterProfileId.length > 0,
		queryFn: async () => {
			const res = await masterProfilesGetOne(masterProfileId, {
				filters: { preset: 'BASE' },
			})

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: 'Ошибка загрузки профиля мастера',
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result.data ?? null
		},
	})
}
