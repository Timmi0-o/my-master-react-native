import type { IMasterProfileEdit } from '@/actions/master/models/master-profile-edit.schema'
import { MasterProfileEditSchema } from '@/actions/master/models/master-profile-edit.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useMasterProfileUpdate } from '@/hooks/actions/master/use-master-profile-update'
import { useRouter } from 'expo-router'
import { useToast } from 'heroui-native'

export function useOnSubmitMasterProfileEditForm(masterProfileId: string) {
	const router = useRouter()
	const { toast } = useToast()
	const updateMutation = useMasterProfileUpdate(masterProfileId)

	const onSubmit = async (formData: IMasterProfileEdit): Promise<void> => {
		const validated = MasterProfileEditSchema.safeParse(formData)

		if (!validated.success) {
			const firstMessage = validated.error.issues[0]?.message

			if (firstMessage) {
				toast.show({
					variant: 'danger',
					label: firstMessage,
				})
			}

			return
		}

		const data = validated.data
		const pausedUntilIso =
			data.bookingStatus === 'PAUSED' && data.pausedUntil.trim()
				? new Date(data.pausedUntil.trim().replace(' ', 'T')).toISOString()
				: null

		await updateMutation.mutateAsync({
			bookingStatus: data.bookingStatus,
			timezone: data.timezone,
			pausedUntil: data.bookingStatus === 'PAUSED' ? pausedUntilIso : null,
			minNoticeMinutes: Number(data.minNoticeMinutes),
			maxBookingDaysAhead: Number(data.maxBookingDaysAhead),
			slotStepMinutes: Number(data.slotStepMinutes),
			bufferBetweenAppointmentsMinutes: Number(
				data.bufferBetweenAppointmentsMinutes,
			),
		})

		toast.show({
			variant: 'success',
			label: scopedT('saved', 'common', 'toasts'),
		})
		router.back()
	}

	return {
		onSubmit,
		isPending: updateMutation.isPending,
	}
}
