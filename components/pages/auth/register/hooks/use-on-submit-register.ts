import type { IRegister } from '@/actions/auth/models/login.schema'
import { useAuth } from '@/stores/auth'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useRouter } from 'expo-router'
import { useToast } from 'heroui-native'

export const useOnSubmitRegister = () => {
	const { signUp } = useAuth()
	const router = useRouter()
	const { toast } = useToast()

	return async (data: IRegister) => {
		const res = await signUp(data)

		if (!res.result?.data) {
			toast.show({
				variant: 'danger',
				label: scopedT('registerFailed', 'common', 'toasts.auth'),
				description: res.error?.message,
			})
			return
		}

		toast.show({
			variant: 'success',
			label: scopedT('registerSuccess', 'common', 'toasts.auth'),
		})
		router.replace('/')
	}
}
