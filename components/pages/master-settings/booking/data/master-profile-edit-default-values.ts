import type { IMasterProfileEdit } from '@/actions/master/models/master-profile-edit.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { resolveMasterTimezone } from '@/constants/master-timezones.constants'

export const MASTER_PROFILE_EDIT_DEFAULT_VALUES = (
	masterProfile: IMasterProfile,
): IMasterProfileEdit => ({
	bookingStatus: masterProfile.bookingStatus ?? 'ACCEPTING',
	pausedUntil: masterProfile.pausedUntil
		? masterProfile.pausedUntil.slice(0, 16).replace('T', ' ')
		: '',
	timezone: resolveMasterTimezone(masterProfile.timezone),
	minNoticeMinutes: String(masterProfile.minNoticeMinutes ?? 60),
	maxBookingDaysAhead: String(masterProfile.maxBookingDaysAhead ?? 60),
	slotStepMinutes: String(masterProfile.slotStepMinutes ?? 30),
	bufferBetweenAppointmentsMinutes: String(
		masterProfile.bufferBetweenAppointmentsMinutes ?? 0,
	),
})
