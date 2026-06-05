import {
	buildMasterTimezoneOptions,
	type TMasterTimezoneId,
} from '@/constants/master-timezones.constants'
import { useAppLocale } from '@/configs/i18n/locale-context'
import { resolveLocale } from '@/configs/i18n/supported-locales'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	FieldError,
	Label,
	Select,
	TextField,
} from 'heroui-native'
import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface ITimezoneSelectFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
}

export function TimezoneSelectField<T extends FieldValues>({
	control,
	name,
}: ITimezoneSelectFieldProps<T>): ReactElement {
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { locale: appLocale } = useAppLocale()
	const locale = resolveLocale(appLocale)

	const timezoneOptions = useMemo(
		() => buildMasterTimezoneOptions(locale),
		[locale],
	)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const selectedTimezone = field.value as TMasterTimezoneId
				const selectedOption = timezoneOptions.find(
					(option) => option.value === selectedTimezone,
				)

				return (
					<TextField isInvalid={!!fieldState.error}>
						<Label>{tField('timezone')}</Label>
						<Select
							presentation='bottom-sheet'
							value={selectedOption}
							onValueChange={(option) => {
								const nextValue =
									option && 'value' in option
										? (option.value as TMasterTimezoneId)
										: selectedTimezone

								field.onChange(nextValue)
							}}
						>
							<Select.Trigger>
								<Select.Value placeholder={tField('timezone')} />
								<Select.TriggerIndicator />
							</Select.Trigger>
							<Select.Portal>
								<Select.Overlay />
								<Select.Content
									presentation='bottom-sheet'
									snapPoints={['50%', '90%']}
								>
									<Select.ListLabel>{tField('timezone')}</Select.ListLabel>
									{timezoneOptions.map((option) => (
										<Select.Item
											key={option.value}
											label={option.label}
											value={option.value}
										/>
									))}
								</Select.Content>
							</Select.Portal>
						</Select>
						{fieldState.error?.message ? (
							<FieldError>{fieldState.error.message}</FieldError>
						) : null}
					</TextField>
				)
			}}
		/>
	)
}
