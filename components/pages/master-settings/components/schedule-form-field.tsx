import {
	GlassInputShell,
	glassInnerInputClassName,
} from '@/components/shared/ui/glass-input/glass-input'
import { FieldError, InputGroup, Label, TextField } from 'heroui-native'
import type { ReactElement } from 'react'
import {
	Control,
	Controller,
	FieldPath,
	FieldValues,
} from 'react-hook-form'
import type { TextInputProps } from 'react-native'

interface IScheduleFormFieldProps<T extends FieldValues> {
	control: Control<T>
	name: FieldPath<T>
	label: string
	inputProps?: Omit<
		TextInputProps,
		'value' | 'onChangeText' | 'onBlur' | 'editable'
	>
}

export function ScheduleFormField<T extends FieldValues>({
	control,
	name,
	label,
	inputProps,
}: IScheduleFormFieldProps<T>): ReactElement {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<TextField isInvalid={!!fieldState.error}>
					<Label>{label}</Label>
					<GlassInputShell>
						<InputGroup>
							<InputGroup.Input
								className={glassInnerInputClassName}
								value={(field.value ?? '') as string}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								{...inputProps}
							/>
						</InputGroup>
					</GlassInputShell>
					{fieldState.error?.message ? (
						<FieldError>{fieldState.error.message}</FieldError>
					) : null}
				</TextField>
			)}
		/>
	)
}
