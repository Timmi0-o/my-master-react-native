import type { IAppointment } from '@/actions/appointment/models/appointment.schema'
import type { ActiveProfileMode } from '@/configs/active-profile-mode/active-profile-mode.types'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { RecordCard } from './record-card'
import { formatAppointmentGroupLabel } from './utils/format-appointment-group-label.util'
import {
	groupAppointmentsByDate,
	limitGroupedAppointments,
} from './utils/group-appointments-by-date.util'

interface IRecordCardListProps {
	appointments: IAppointment[]
	mode: ActiveProfileMode
	limit?: number
	onBeforeNavigate?: () => void
}

export function RecordCardList({
	appointments,
	mode,
	limit,
	onBeforeNavigate,
}: IRecordCardListProps): ReactElement {
	const groups = useMemo(() => {
		const grouped = groupAppointmentsByDate(appointments)

		return limit != null ? limitGroupedAppointments(grouped, limit) : grouped
	}, [appointments, limit])

	return (
		<View className='gap-4'>
			{groups.map((group) => (
				<View key={group.dateKey} className='gap-2 px-1'>
					<Text className='px-1 font-semibold text-muted text-lg'>
						{formatAppointmentGroupLabel(group.dateKey)}
					</Text>

					<View className='gap-3'>
						{group.items.map((appointment) => (
							<RecordCard
								key={appointment.id}
								appointment={appointment}
								mode={mode}
								onBeforeNavigate={onBeforeNavigate}
							/>
						))}
					</View>
				</View>
			))}
		</View>
	)
}
