export type ActiveProfileMode = 'client' | 'master'

export const ACTIVE_PROFILE_MODES: ActiveProfileMode[] = ['client', 'master']

export const isActiveProfileMode = (
	value: string | null | undefined,
): value is ActiveProfileMode =>
	value === 'client' || value === 'master'
