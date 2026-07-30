export type ActionErrorTranslationRef = {
	keyPrefix: string
	key: string
}

/** Maps API error.message substrings to i18n keys under common.actionErrors. */
export const ACTION_ERROR_TRANSLATION_REGISTRY: ReadonlyArray<{
	match: string
	ref: ActionErrorTranslationRef
}> = [
	{
		match: 'cannot have more than',
		ref: {
			keyPrefix: 'actionErrors.masterService',
			key: 'maxImagesCount',
		},
	},
	{
		match: 'Empty response. There are no subscribers',
		ref: {
			keyPrefix: 'actionErrors.shared',
			key: 'noSubscribers',
		},
	},
	{
		match: 'Appointment slot is not available',
		ref: {
			keyPrefix: 'actionErrors.appointment',
			key: 'slotNotAvailable',
		},
	},
]
