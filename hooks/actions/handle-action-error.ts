import { IAppActionResponse } from '@/contracts/api-response/types'
import { useToast } from 'heroui-native'

export const useHandleActionError = () => {
	const { toast } = useToast()

	return (res: IAppActionResponse<unknown>, fallbackMessage: string) => {
		if (res.error) {
			toast.show({
				variant: 'danger',
				label: fallbackMessage,
				description: res.error.message,
			})
			throw new Error(res.error.message)
		}
	}
}

export const handleActionError = (
	res: IAppActionResponse<unknown>,
	fallbackMessage: string,
	onError?: (message: string) => void,
) => {
	if (res.error) {
		onError?.(res.error.message)
		throw new Error(res.error.message)
	}
}
