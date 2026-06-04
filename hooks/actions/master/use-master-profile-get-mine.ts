import { masterProfilesGetMe } from '@/actions/master/actions'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { useAuth } from '@/configs/auth/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterProfileGetMine = () => {
	const { toast } = useToast()
	const { state } = useAuth()
	const isAuthenticated = state.status === 'authenticated'

	const { data, isLoading, error } = useQuery<IMasterProfile | null>({
		queryKey: ['master-profiles', 'me'],
		enabled: isAuthenticated,
		queryFn: async () => {
			const res = await masterProfilesGetMe({
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

	return { data, isLoading, error }
}
