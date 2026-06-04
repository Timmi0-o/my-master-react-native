import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import type { TMasterScheduleExceptionKind } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { EXCEPTION_KIND_LABELS } from '@/constants/master-schedule.constants'
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

		toast.show({ variant: 'success', label: 'Сохранено' })
		router.back()
	}

	if (isEdit && isLoading) {
		return (
			<BasePage>
				<Text className='text-muted'>Загрузка...</Text>
			</BasePage>
		)
	}

	return (
		<BasePage>
			<ScheduleScreenHeader
				title={isEdit ? 'Редактировать исключение' : 'Новое исключение'}
			/>

			<View style={{ rowGap: 16 }}>
				<Card>
					<Card.Header>
						<Text className='font-semibold text-foreground'>Тип</Text>
					</Card.Header>
					<Card.Body className='gap-2 p-0'>
						{EXCEPTION_KINDS.map((k) => (
							<Button
								key={k}
								size='sm'
								variant={kind === k ? 'primary' : 'outline'}
								onPress={() => setKind(k)}
							>
								<Button.Label>{EXCEPTION_KIND_LABELS[k]}</Button.Label>
							</Button>
						))}
					</Card.Body>
				</Card>

				<ScheduleSimpleField
					label='Начало периода (YYYY-MM-DD HH:mm)'
					value={startsAt}
					onChangeText={setStartsAt}
				/>
				<ScheduleSimpleField
					label='Конец периода (YYYY-MM-DD HH:mm)'
					value={endsAt}
					onChangeText={setEndsAt}
				/>

				{kind === 'CUSTOM_HOURS' ? (
					<>
						<ScheduleSimpleField
							label='Начало работы (HH:mm)'
							value={customStartTime}
							onChangeText={setCustomStartTime}
						/>
						<ScheduleSimpleField
							label='Конец работы (HH:mm)'
							value={customEndTime}
							onChangeText={setCustomEndTime}
						/>
					</>
				) : null}

				<ScheduleSimpleField
					label='Заголовок (опционально)'
					value={title}
					onChangeText={setTitle}
				/>
				<ScheduleSimpleField
					label='Заметка (опционально)'
					value={note}
					onChangeText={setNote}
				/>

				<Button
					variant='primary'
					onPress={() => void handleSave()}
					isDisabled={createMutation.isPending || updateMutation.isPending}
				>
					<Button.Label>Сохранить</Button.Label>
				</Button>
			</View>
		</BasePage>
	)
}
