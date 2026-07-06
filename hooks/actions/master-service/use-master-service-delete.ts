import { masterServicesDelete } from '@/actions/master-service/actions'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useConfirmation } from '@/hooks/use-confirmation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'

export const useMasterServiceDelete = () => {
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const confirm = useConfirmation()

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await masterServicesDelete(id)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('deleteFailed', 'common', 'toasts.masterService'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data ?? null
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['master-services'] })
			toast.show({
				variant: 'success',
				label: scopedT('deleted', 'common', 'toasts.masterService'),
			})
		},
	})

	const deleteService = (id: string, onSuccess?: () => void): void => {
		confirm({
			title: scopedT('deleteServiceTitle', 'pages', 'masterSettings'),
			description: scopedT(
				'deleteServiceDescription',
				'pages',
				'masterSettings',
			),
			status: 'danger',
			primaryLabel: scopedT('delete', 'ui', 'button'),
			cancelLabel: scopedT('cancel', 'ui', 'button'),
			onConfirm: () => {
				void mutation.mutateAsync(id)
				onSuccess?.()
			},
		})
	}

	return {
		deleteService,
		isPending: mutation.isPending,
	}
}
