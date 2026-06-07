import type { TMasterBookingStatus } from '@/actions/master/models/master-profile.schema'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { Ionicons } from '@expo/vector-icons'
import { Card, RadioGroup, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Text, View } from 'react-native'

const BOOKING_STATUSES: TMasterBookingStatus[] = [
	'ACCEPTING',
	'PAUSED',
	'CLOSED',
]

const BOOKING_STATUS_ICONS: Record<
	TMasterBookingStatus,
	keyof typeof Ionicons.glyphMap
> = {
	ACCEPTING: 'checkmark-circle-outline',
	PAUSED: 'pause-circle-outline',
	CLOSED: 'close-circle-outline',
}

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
	const mutedColor = useThemeColor('muted')

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<RadioGroup
					className='w-full'
					value={field.value as string}
					onValueChange={field.onChange}
				>
					<Card>
						<Card.Body className='w-full flex-row gap-2'>
							{BOOKING_STATUSES.map((status) => (
								<RadioGroup.Item
									key={status}
									className='flex-1 flex-col items-stretch'
									style={{ flex: 1, flexBasis: 0, flexDirection: 'column' }}
									value={status}
								>
									{({ isSelected }) => (
										<View
											className={`w-full items-center rounded-2xl border border-border px-2 py-4 ${
												isSelected ? 'bg-accent-soft' : 'bg-surface'
											}`}
											style={{ minHeight: 96 }}
										>
											<Ionicons
												color={isSelected ? accentColor : mutedColor}
												name={BOOKING_STATUS_ICONS[status]}
												size={28}
											/>
											<Text
												className={`mt-2 text-center text-xs font-semibold ${
													isSelected ? 'text-foreground' : 'text-muted'
												}`}
												numberOfLines={3}
											>
												{bookingStatusLabel(status)}
											</Text>
										</View>
									)}
								</RadioGroup.Item>
							))}
						</Card.Body>
					</Card>
				</RadioGroup>
			)}
		/>
	)
}
