import { ILogin } from '@/actions/auth/models/login.schema'
import { useAuth } from '@/configs/auth/auth-context'
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
				label: 'Ошибка входа',
				description: res.error?.message ?? 'Не удалось выполнить вход',
			})
		} else {
			toast.show({
				variant: 'success',
				label: 'Вход выполнен успешно',
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
