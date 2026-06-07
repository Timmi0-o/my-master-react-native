import { useAppLocale } from '@/configs/i18n/locale-context'
import { resolveLocale } from '@/configs/i18n/supported-locales'
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
import {
	buildLocalDateTimeDateOptions,
	buildLocalDateTimeTimeOptions,
	combinePausedUntilValue,
	formatPausedUntilDateKey,
	formatPausedUntilLabel,
	formatPausedUntilTimeKey,
	parsePausedUntilValue,
	type IBuildLocalDateTimeDateOptionsParams,
	type IBuildLocalDateTimeTimeOptionsParams,
} from '../helpers/build-paused-until-options'

interface IDateTimeSelectFieldProps<T extends FieldValues> {
	control: Control<T>
	name: Path<T>
	label: string
	placeholder: string
	dateOptionsParams?: IBuildLocalDateTimeDateOptionsParams
	timeOptionsParams?: IBuildLocalDateTimeTimeOptionsParams
}

export function DateTimeSelectField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	dateOptionsParams,
	timeOptionsParams,
}: IDateTimeSelectFieldProps<T>): ReactElement {
	const { t: tField } = useScopedTranslation('ui', 'field')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { locale: appLocale } = useAppLocale()
	const locale = resolveLocale(appLocale)
	const mutedColor = useThemeColor('muted')
	const [isPickerOpen, setIsPickerOpen] = useState(false)
	const [draftDateKey, setDraftDateKey] = useState('')
	const [draftTimeKey, setDraftTimeKey] = useState('')

	const dateOptions = useMemo(
		() => buildLocalDateTimeDateOptions(locale, dateOptionsParams),
		[dateOptionsParams, locale],
	)

	const timeOptions = useMemo(
		() => buildLocalDateTimeTimeOptions(draftDateKey, timeOptionsParams),
		[draftDateKey, timeOptionsParams],
	)

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				const storedValue = (field.value ?? '') as string
				const displayValue = formatPausedUntilLabel(storedValue, locale)

				const selectedDateOption =
					dateOptions.find((option) => option.value === draftDateKey) ??
					dateOptions[0]

				const selectedTimeOption =
					timeOptions.find((option) => option.value === draftTimeKey) ??
					timeOptions[0]

				const openPicker = (): void => {
					const parsed = parsePausedUntilValue(storedValue)
					const nextDateKey = formatPausedUntilDateKey(parsed)
					const timesForDate = buildLocalDateTimeTimeOptions(
						nextDateKey,
						timeOptionsParams,
					)
					const parsedTimeKey = formatPausedUntilTimeKey(parsed)
					const nextTimeKey =
						timesForDate.find((option) => option.value === parsedTimeKey)
							?.value ??
						timesForDate[0]?.value ??
						'00:00'

					setDraftDateKey(nextDateKey)
					setDraftTimeKey(nextTimeKey)
					setIsPickerOpen(true)
				}

				const closePicker = (): void => {
					setIsPickerOpen(false)
				}

				const handleConfirm = (): void => {
					field.onChange(
						combinePausedUntilValue(
							selectedDateOption.value,
							selectedTimeOption.value,
						),
					)
					field.onBlur()
					setIsPickerOpen(false)
				}

				const handleDateChange = (
					option: { value?: string; label?: string } | null | undefined,
				): void => {
					const nextDateKey =
						option && 'value' in option && option.value
							? option.value
							: draftDateKey

					setDraftDateKey(nextDateKey)

					const nextTimeOptions = buildLocalDateTimeTimeOptions(
						nextDateKey,
						timeOptionsParams,
					)
					const hasCurrentTime = nextTimeOptions.some(
						(timeOption) => timeOption.value === draftTimeKey,
					)

					if (!hasCurrentTime) {
						setDraftTimeKey(nextTimeOptions[0]?.value ?? '00:00')
					}
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
							<Ionicons color={mutedColor} name='calendar-outline' size={20} />
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

									<TextField>
										<Label>{tField('date')}</Label>
										<Select
											presentation='bottom-sheet'
											value={selectedDateOption}
											onValueChange={handleDateChange}
										>
											<Select.Trigger>
												<Select.Value placeholder={tField('date')} />
												<Select.TriggerIndicator />
											</Select.Trigger>
											<Select.Portal>
												<Select.Overlay />
												<Select.Content
													presentation='bottom-sheet'
													snapPoints={['50%', '90%']}
												>
													<Select.ListLabel>{tField('date')}</Select.ListLabel>
													{dateOptions.map((option) => (
														<Select.Item
															key={option.value}
															label={option.label}
															value={option.value}
														/>
													))}
												</Select.Content>
											</Select.Portal>
										</Select>
									</TextField>

									<TextField>
										<Label>{tField('startTime')}</Label>
										<Select
											presentation='bottom-sheet'
											value={selectedTimeOption}
											onValueChange={handleTimeChange}
										>
											<Select.Trigger>
												<Select.Value placeholder={tField('startTime')} />
												<Select.TriggerIndicator />
											</Select.Trigger>
											<Select.Portal>
												<Select.Overlay />
												<Select.Content
													presentation='bottom-sheet'
													snapPoints={['50%']}
												>
													<Select.ListLabel>
														{tField('startTime')}
													</Select.ListLabel>
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
									</TextField>

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
