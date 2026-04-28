import { ILogin } from '@/actions/auth/models/login.schema'
import { useAuth } from '@/configs/auth/auth-context'
import { useToast } from 'heroui-native'

const FINGERPRINT = 'SHA256:O4u+7hJZf9K8yE3x5Lk9aBv1P2sQdR6tYhJ8mN0oPqU'

export const useOnSubmit = () => {
	const { signIn } = useAuth()

	const { toast } = useToast()

	const onSubmit = async (data: ILogin) => {
		const res = await signIn({ ...data, fingerprint: FINGERPRINT })

		if (res.error?.message) {
			toast.show({
				variant: 'danger',
				label: 'Ошибка входа',
				description: res.error.message,
			})
		}
	}

	return onSubmit
}
