import {
	GlassInputShell,
	glassInnerInputClassName,
} from '@/components/shared/ui/glass-input/glass-input'
import { Ionicons } from '@expo/vector-icons'
import {
	FieldError,
	InputGroup,
	Label,
	TextField,
	useThemeColor,
} from 'heroui-native'
import type { ReactElement, ReactNode } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import type { TextInputProps } from 'react-native'

interface IAuthInputFieldProps<T extends FieldValues> {
	control: Control<T>
	name: FieldPath<T>
	label: string
	leftIcon: keyof typeof Ionicons.glyphMap
	rightSlot?: ReactNode
	isDisabled?: boolean
	inputProps?: Omit<
		TextInputProps,
		'value' | 'onChangeText' | 'onBlur' | 'editable'
	>
}

/**
 * Form field wrapper used by auth screens.
 *
 * Joins react-hook-form `Controller` with heroui-native `TextField + InputGroup`
 * so screens declare only the fieldless shape (label, icon, input props) without
 * repeating glue code per field.
 */
export function AuthInputField<T extends FieldValues>({
	control,
	name,
	label,
	leftIcon,
	rightSlot,
	isDisabled,
	inputProps,
}: IAuthInputFieldProps<T>): ReactElement {
	const mutedColor = useThemeColor('muted')

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<TextField isRequired isInvalid={!!fieldState.error}>
					<Label>{label}</Label>
					<GlassInputShell>
						<InputGroup isDisabled={isDisabled}>
							<InputGroup.Prefix isDecorative>
								<Ionicons name={leftIcon} size={18} color={mutedColor} />
							</InputGroup.Prefix>
							<InputGroup.Input
								className={glassInnerInputClassName}
								value={(field.value ?? '') as string}
								onChangeText={field.onChange}
								onBlur={field.onBlur}
								{...inputProps}
							/>
							{rightSlot ? (
								<InputGroup.Suffix>{rightSlot}</InputGroup.Suffix>
							) : null}
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
