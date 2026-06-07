import type { TMasterScheduleExceptionKind } from '@/actions/master-schedule-exception/models/master-schedule-exception.schema'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { Label, Radio, RadioGroup, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { View } from 'react-native'

const EXCEPTION_KINDS: TMasterScheduleExceptionKind[] = [
	'CLOSED',
	'CUSTOM_HOURS',
]

interface IExceptionKindFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
}

export function ExceptionKindField<T extends FieldValues>({
	control,
	name,
}: IExceptionKindFieldProps<T>): ReactElement {
	const exceptionKindLabel = useEnumLabel('enums.exceptionKind')
	const accentColor = useThemeColor('accent')

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<RadioGroup
					value={field.value as string}
					onValueChange={field.onChange}
				>
					<View className='gap-3'>
						{EXCEPTION_KINDS.map((kind) => (
							<RadioGroup.Item key={kind} value={kind}>
								{({ isSelected }) => (
									<View
										className={`flex-row items-center gap-3 rounded-2xl border border-border p-4 ${
											isSelected
												? 'bg-surface'
												: 'bg-background-secondary'
										}`}
										style={
											isSelected
												? { borderColor: accentColor }
												: undefined
										}
									>
										<View className='flex-1'>
											<Label>{exceptionKindLabel(kind)}</Label>
										</View>
										<Radio />
									</View>
								)}
							</RadioGroup.Item>
						))}
					</View>
				</RadioGroup>
			)}
		/>
	)
}
