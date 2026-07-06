import { masterProfilesGetMe } from '@/actions/master/actions'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { useAuth } from '@/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterProfileGetMine = () => {
	const { toast } = useToast()
	const { isAuthenticated } = useAuth()

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
					label: scopedT('loadMineFailed', 'common', 'toasts.masterProfile'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? null
		},
	})

	return { data, isLoading, error }
}
