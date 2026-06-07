import type { TMasterBookingStatus } from '@/actions/master/models/master-profile.schema'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { Label, Radio, RadioGroup, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { View } from 'react-native'

const BOOKING_STATUSES: TMasterBookingStatus[] = [
	'ACCEPTING',
	'PAUSED',
	'CLOSED',
]

interface IBookingStatusFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
}

export function BookingStatusField<T extends FieldValues>({
	control,
	name,
}: IBookingStatusFieldProps<T>): ReactElement {
	const bookingStatusLabel = useEnumLabel('enums.bookingStatus')
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
						{BOOKING_STATUSES.map((status) => (
							<RadioGroup.Item key={status} value={status}>
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
											<Label>{bookingStatusLabel(status)}</Label>
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
