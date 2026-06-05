import {
	MasterScheduleExceptionEditSchema,
	type IMasterScheduleExceptionEdit,
} from '@/actions/master-schedule-exception/models/master-schedule-exception-edit.schema'
import { localDateTimeValueToIso } from '@/components/pages/master-settings/helpers/build-paused-until-options'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useMasterScheduleExceptionCreate } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-create'
import { useMasterScheduleExceptionUpdate } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-update'
import { useRouter } from 'expo-router'
import { useToast } from 'heroui-native'

interface IUseOnSubmitMasterScheduleExceptionEditFormParams {
	masterProfileId: string
	exceptionId?: string
}

export function useOnSubmitMasterScheduleExceptionEditForm({
	masterProfileId,
	exceptionId,
}: IUseOnSubmitMasterScheduleExceptionEditFormParams) {
	const router = useRouter()
	const { toast } = useToast()
	const isEdit = Boolean(exceptionId)
	const createMutation = useMasterScheduleExceptionCreate(masterProfileId)
	const updateMutation = useMasterScheduleExceptionUpdate(masterProfileId)

	const onSubmit = async (formData: IMasterScheduleExceptionEdit): Promise<void> => {
		const validated = MasterScheduleExceptionEditSchema.safeParse(formData)

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
		const payload = {
			startsAt: localDateTimeValueToIso(data.startsAt),
			endsAt: localDateTimeValueToIso(data.endsAt),
			kind: data.kind,
			customStartTime:
				data.kind === 'CUSTOM_HOURS' ? data.customStartTime.trim() : null,
			customEndTime:
				data.kind === 'CUSTOM_HOURS' ? data.customEndTime.trim() : null,
			title: data.title.trim() || null,
			note: data.note.trim() || null,
		}

		if (isEdit && exceptionId) {
			await updateMutation.mutateAsync({
				id: exceptionId,
				payload,
			})
		} else {
			await createMutation.mutateAsync({
				masterProfileId,
				...payload,
			})
		}

		toast.show({
			variant: 'success',
			label: scopedT('saved', 'common', 'toasts'),
		})
		router.back()
	}

	return {
		onSubmit,
		isPending: createMutation.isPending || updateMutation.isPending,
	}
}
