import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { TMasterScheduleExceptionKind } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterScheduleExceptionCreate } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-create'
import { useMasterScheduleExceptionGetOne } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-get-one'
import { useMasterScheduleExceptionUpdate } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-update'
import { useRouter } from 'expo-router'
import { Button, Card } from 'heroui-native'
import { useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'
import { ScheduleSimpleField } from './schedule-simple-field'

const EXCEPTION_KINDS: TMasterScheduleExceptionKind[] = [
	'CLOSED',
	'CUSTOM_HOURS',
]

interface IMasterScheduleExceptionEditPageProps {
	masterProfile: IMasterProfile
	exceptionId?: string
}

function toLocalInput(iso: string): string {
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return ''
	return date.toISOString().slice(0, 16).replace('T', ' ')
}

function toIso(local: string): string {
	return new Date(local.trim().replace(' ', 'T')).toISOString()
}

export function MasterScheduleExceptionEditPage({
	masterProfile,
	exceptionId,
}: IMasterScheduleExceptionEditPageProps): ReactElement {
	const router = useRouter()
	const { toast } = useToast()
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tCommon } = useScopedTranslation('common')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tField } = useScopedTranslation('ui', 'field')
	const exceptionKindLabel = useEnumLabel('enums.exceptionKind')
	const isEdit = Boolean(exceptionId)

	const { data: existing, isLoading } = useMasterScheduleExceptionGetOne(
		exceptionId ?? '',
		isEdit,
	)
	const createMutation = useMasterScheduleExceptionCreate(masterProfile.id)
	const updateMutation = useMasterScheduleExceptionUpdate(masterProfile.id)

	const [kind, setKind] = useState<TMasterScheduleExceptionKind>('CLOSED')
	const [startsAt, setStartsAt] = useState('')
	const [endsAt, setEndsAt] = useState('')
	const [customStartTime, setCustomStartTime] = useState('')
	const [customEndTime, setCustomEndTime] = useState('')
	const [title, setTitle] = useState('')
	const [note, setNote] = useState('')

	useEffect(() => {
		if (existing) {
			setKind(existing.kind)
			setStartsAt(toLocalInput(existing.startsAt))
			setEndsAt(toLocalInput(existing.endsAt))
			setCustomStartTime(existing.customStartTime ?? '')
			setCustomEndTime(existing.customEndTime ?? '')
			setTitle(existing.title ?? '')
			setNote(existing.note ?? '')
		}
	}, [existing])

	const handleSave = async (): Promise<void> => {
		const payload = {
			startsAt: toIso(startsAt),
			endsAt: toIso(endsAt),
			kind,
			customStartTime:
				kind === 'CUSTOM_HOURS' ? customStartTime || null : null,
			customEndTime: kind === 'CUSTOM_HOURS' ? customEndTime || null : null,
			title: title.trim() || null,
			note: note.trim() || null,
		}

		if (isEdit && exceptionId) {
			await updateMutation.mutateAsync({ id: exceptionId, payload })
		} else {
			await createMutation.mutateAsync({
				masterProfileId: masterProfile.id,
				...payload,
			})
		}

		toast.show({
			variant: 'success',
			label: scopedT('saved', 'common', 'toasts'),
		})
		router.back()
	}

	if (isEdit && isLoading) {
		return (
			<BasePage>
				<Text className='text-muted'>{tCommon('loading')}</Text>
			</BasePage>
		)
	}

	return (
		<BasePage>
			<ScheduleScreenHeader
				title={isEdit ? t('exceptionEdit') : t('exceptionNew')}
			/>

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>
							{tField('type')}
						</Text>
					</Card.Header>
					<Card.Body className='gap-2 p-0'>
						{EXCEPTION_KINDS.map((k) => (
							<Button
								key={k}
								size='sm'
								variant={kind === k ? 'primary' : 'outline'}
								onPress={() => setKind(k)}
							>
								<Button.Label>{exceptionKindLabel(k)}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				<ScheduleSimpleField
					label={tField('periodStart')}
					value={startsAt}
					onChangeText={setStartsAt}
				/>
				<ScheduleSimpleField
					label={tField('periodEnd')}
					value={endsAt}
					onChangeText={setEndsAt}
				/>

				{kind === 'CUSTOM_HOURS' ? (
					<>
						<ScheduleSimpleField
							label={tField('workStart')}
							value={customStartTime}
							onChangeText={setCustomStartTime}
						/>
						<ScheduleSimpleField
							label={tField('workEnd')}
							value={customEndTime}
							onChangeText={setCustomEndTime}
						/>
					</>
				) : null}

				<ScheduleSimpleField
					label={tField('titleOptional')}
					value={title}
					onChangeText={setTitle}
				/>
				<ScheduleSimpleField
					label={tField('noteOptional')}
					value={note}
					onChangeText={setNote}
				/>

				<Button
					variant='primary'
					onPress={() => void handleSave()}
					isDisabled={createMutation.isPending || updateMutation.isPending}
				>
					<Button.Label>{tBtn('save')}</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
