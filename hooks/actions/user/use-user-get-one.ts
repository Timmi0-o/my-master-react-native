import { userGetOne } from '@/actions/user/actions'
import { IUser } from '@/actions/user/models/user.schema'
import { useQuery } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useUserGetOne = (userId: string) => {
	const { toast } = useToast()

	const { data, isLoading, error } = useQuery<IUser>({
		queryKey: ['user', userId],
		queryFn: async () => {
			const res = await userGetOne()

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('loadFailed', 'common', 'toasts.user'),
					description: res.error.message,
				})
			}

			return res.result.data
		},
	})

	return { data, isLoading, error }
}
