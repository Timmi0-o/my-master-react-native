import { masterProfilesUpdate } from '@/actions/master/actions'
import type { IMasterProfileUpdatePayload } from '@/actions/master/models/master-profile-update-payload.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useToast } from 'heroui-native'

export const useMasterProfileUpdate = (masterProfileId: string) => {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IMasterProfileUpdatePayload) => {
			const res = await masterProfilesUpdate(masterProfileId, payload)

			if (res.error?.message) {
				toast.show({
					variant: 'danger',
					label: scopedT('saveFailed', 'common', 'toasts.masterProfile'),
					description: res.error.message,
				})
				throw new Error(res.error.message)
			}

			return res.result?.data as IMasterProfile
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['master-profiles', 'me'] })
			await queryClient.invalidateQueries({
				queryKey: ['master-profiles', 'one', masterProfileId],
			})
		},
	})
}
