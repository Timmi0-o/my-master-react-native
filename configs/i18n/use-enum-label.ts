import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useCallback } from 'react'

type EnumLabelPrefix =
	| 'enums.dayOfWeek'
	| 'enums.bookingStatus'
	| 'enums.exceptionKind'
	| 'enums.cancelledBy'
	| 'enums.profileMode'

export const useEnumLabel = (keyPrefix: EnumLabelPrefix) => {
	const { t } = useScopedTranslation('common', keyPrefix)

	return useCallback((value: string) => t(value), [t])
}
