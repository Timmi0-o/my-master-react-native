import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { Label, TextField } from 'heroui-native'
import type { ReactElement } from 'react'
import type { TextInputProps } from 'react-native'

interface IScheduleSimpleFieldProps {
	label: string
	value: string
	onChangeText: (value: string) => void
	inputProps?: Omit<TextInputProps, 'value' | 'onChangeText'>
}

export function ScheduleSimpleField({
	label,
	value,
	onChangeText,
	inputProps,
}: IScheduleSimpleFieldProps): ReactElement {
	return (
		<TextField>
			<Label>{label}</Label>
			<GlassInput
				value={value}
				onChangeText={onChangeText}
				{...inputProps}
			/>
		</TextField>
	)
}
