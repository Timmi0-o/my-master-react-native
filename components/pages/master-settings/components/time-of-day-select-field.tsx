import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import {
	Button,
	FieldError,
	Label,
	Select,
	TextField,
	useThemeColor,
} from 'heroui-native'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Modal, Pressable, Text, View } from 'react-native'
import { buildTimeOfDayOptions } from '../helpers/build-paused-until-options'

interface ITimeOfDaySelectFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label: string
	placeholder: string
}

export function TimeOfDaySelectField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
}: ITimeOfDaySelectFieldProps<T>): ReactElement {
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const mutedColor = useThemeColor('muted')
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [draftTimeKey, setDraftTimeKey] = useState('09:00')
	const timeOptions = useMemo(() => buildTimeOfDayOptions(), [])

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const storedValue = (field.value ?? '') as string
				const displayValue = storedValue.trim()

				const selectedTimeOption =
					timeOptions.find((option) => option.value === draftTimeKey) ??
					timeOptions.find((option) => option.value === displayValue) ??
					timeOptions[0]

				const openPicker = (): void => {
					setDraftTimeKey(displayValue || timeOptions[0]?.value || '09:00')
					setIsPickerOpen(true)
				}

				const closePicker = (): void => {
					setIsPickerOpen(false)
				}

				const handleConfirm = (): void => {
					field.onChange(selectedTimeOption.value)
					field.onBlur()
					setIsPickerOpen(false)
				}

				const handleTimeChange = (
					option: { value?: string; label?: string } | null | undefined,
				): void => {
					const nextTimeKey =
						option && 'value' in option && option.value
							? option.value
							: draftTimeKey

					setDraftTimeKey(nextTimeKey)
				}

				return (
					<TextField isInvalid={!!fieldState.error}>
						<Label>{label}</Label>

						<Pressable
							accessibilityRole='button'
							className='flex-row items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 active:opacity-80'
							onPress={openPicker}
						>
							<Text
								className={
									displayValue
										? 'text-base text-foreground'
										: 'text-base text-muted'
								}
							>
								{displayValue || placeholder}
							</Text>
							<Ionicons color={mutedColor} name='time-outline' size={20} />
						</Pressable>

						<Modal
							animationType='slide'
							onRequestClose={closePicker}
							transparent
							visible={isPickerOpen}
						>
							<View className='flex-1 justify-end'>
								<Pressable
									accessibilityRole='button'
									className='absolute inset-0 bg-black/40'
									onPress={closePicker}
								/>
								<View className='gap-4 rounded-t-3xl bg-background px-4 pb-8 pt-3'>
									<View className='self-center h-1 w-10 rounded-full bg-muted' />
									<Text className='text-lg font-semibold text-foreground'>
										{label}
									</Text>

									<Select
										presentation='bottom-sheet'
										value={selectedTimeOption}
										onValueChange={handleTimeChange}
									>
										<Select.Trigger>
											<Select.Value placeholder={placeholder} />
											<Select.TriggerIndicator />
										</Select.Trigger>
										<Select.Portal>
											<Select.Overlay />
											<Select.Content
												presentation='bottom-sheet'
												snapPoints={['50%']}
											>
												<Select.ListLabel>{label}</Select.ListLabel>
												{timeOptions.map((option) => (
													<Select.Item
														key={option.value}
														label={option.label}
														value={option.value}
													/>
												))}
											</Select.Content>
										</Select.Portal>
									</Select>

									<Button
										className='rounded-2xl'
										onPress={handleConfirm}
										variant='primary'
									>
										<Button.Label>{tBtn('done')}</Button.Label>
									</Button>
								</View>
							</View>
						</Modal>

						{fieldState.error?.message ? (
							<FieldError>{fieldState.error.message}</FieldError>
						) : null}
					</TextField>
				)
			}}
		/>
	)
}
