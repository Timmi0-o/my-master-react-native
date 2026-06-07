import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { ReactElement } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { DateTimeSelectField } from '../../components/datetime-select-field'

interface IPausedUntilFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
}

export function PausedUntilField<T extends FieldValues>({
	control,
	name,
}: IPausedUntilFieldProps<T>): ReactElement {
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')

	return (
		<DateTimeSelectField
			control={control}
			dateOptionsParams={{ pastDays: 0, futureDays: 90 }}
			label={tField('pauseUntil')}
			name={name}
			placeholder={tPlaceholder('pauseUntil')}
			timeOptionsParams={{ enforceFutureForToday: true }}
		/>
	)
}
