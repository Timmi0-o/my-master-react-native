import type { IRegister } from '@/actions/auth/models/login.schema'
import { useAppLocale } from '@/configs/i18n/locale-context'
import { scopedT } from '@/configs/i18n/scoped-t'
import { appLocaleToApiLanguage } from '@/helpers/i18n/api-language'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'expo-router'
import { useToast } from 'heroui-native'

export const useOnSubmitRegister = () => {
	const { signUp } = useAuth()
	const { locale } = useAppLocale()
	const router = useRouter()
	const { toast } = useToast()

	return async (data: IRegister) => {
		const res = await signUp({
			...data,
			language: appLocaleToApiLanguage(locale),
		})

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
