import { IAppointment } from '@/actions/appointment/models/appointment.schema'
import { ChipColor } from 'heroui-native'

export function getStatusChipColor(status: IAppointment['status']): ChipColor {
	switch (status) {
		case 'PENDING':
			return 'warning'
		case 'CONFIRMED':
			return 'accent'
		case 'CANCELLED':
		case 'NO_SHOW':
			return 'danger'
		case 'COMPLETED':
			return 'success'
	}
}
