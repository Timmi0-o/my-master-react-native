import type { IMasterScheduleException } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import type { IMasterScheduleExceptionEdit } from '@/actions/master-schedule-exception/models/master-schedule-exception-edit.schema'
import {
	formatPausedUntilValue,
	isoToLocalDateTimeValue,
	parsePausedUntilValue,
} from '../helpers/build-paused-until-options'

export function MASTER_SCHEDULE_EXCEPTION_EDIT_DEFAULT_VALUES(
	exception?: IMasterScheduleException,
): IMasterScheduleExceptionEdit {
	if (!exception) {
		const startsAt = parsePausedUntilValue('')
		const endsAt = new Date(startsAt)
		endsAt.setHours(23, 30, 0, 0)

		return {
			kind: 'CLOSED',
			startsAt: formatPausedUntilValue(startsAt),
			endsAt: formatPausedUntilValue(endsAt),
			customStartTime: '09:00',
			customEndTime: '18:00',
			title: '',
			note: '',
		}
	}

	return {
		kind: exception.kind,
		startsAt: isoToLocalDateTimeValue(exception.startsAt),
		endsAt: isoToLocalDateTimeValue(exception.endsAt),
		customStartTime: exception.customStartTime ?? '',
		customEndTime: exception.customEndTime ?? '',
		title: exception.title ?? '',
		note: exception.note ?? '',
	}
}
