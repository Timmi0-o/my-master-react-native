import { ILogin } from '@/actions/auth/models/login.schema'
import { useAuth } from '@/configs/auth/auth-context'
import { scopedT } from '@/configs/i18n/scoped-t'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useThemeColor, useToast } from 'heroui-native'

export const useOnSubmit = () => {
	const { signIn } = useAuth()
	const router = useRouter()

	const { toast } = useToast()

	const successColor = useThemeColor('success')

	const onSubmit = async (data: ILogin) => {
		const res = await signIn(data)

		const isSuccess = Boolean(res.result?.data)

		if (!isSuccess) {
			toast.show({
				variant: 'danger',
				label: scopedT('loginFailed', 'common', 'toasts.auth'),
				description:
					res.error?.message ??
					scopedT('loginFailedDescription', 'common', 'toasts.auth'),
			})
		} else {
			toast.show({
				variant: 'success',
				label: scopedT('loginSuccess', 'common', 'toasts.auth'),
				icon: (
					<Ionicons
						name='checkmark-circle-outline'
						size={24}
						color={successColor}
					/>
				),
			})
			router.replace('/')
		}
	}

	return onSubmit
}
