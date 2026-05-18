import { ILogin, LoginSchema } from '@/actions/auth/models/login.schema'
import { BasePage } from '@/components/shared/ui/base-page'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Spinner, useThemeColor } from 'heroui-native'
import { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native'
import Animated, {
	FadeIn,
	FadeInDown,
	LinearTransition,
} from 'react-native-reanimated'
import { AuthInputField } from './auth-input-field'
import { LOGIN_FORM_DEFAULT_VALUES } from './data/login-form-default-values'
import { useOnSubmit } from './hooks/use-on-submit'

export default function LoginPage(): ReactElement {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ILogin>({
		resolver: zodResolver(LoginSchema),
		defaultValues: LOGIN_FORM_DEFAULT_VALUES,
		mode: 'onTouched',
	})

	const onSubmit = useOnSubmit()

	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const [accentColor, accentForegroundColor, mutedColor] = useThemeColor([
		'accent',
		'accent-foreground',
		'muted',
	])

	return (
		<BasePage>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					contentContainerClassName='grow justify-center px-6 py-8'
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={false}
				>
					<Animated.View
						entering={FadeInDown.duration(450)}
						style={{ marginBottom: 40, alignItems: 'center' }}
					>
						<View
							className='mb-5 items-center justify-center'
							style={{
								width: 64,
								height: 64,
								borderRadius: 24,
								backgroundColor: accentColor,
							}}
						>
							<Ionicons
								name={
									isSubmitting ? 'lock-open-outline' : 'lock-closed-outline'
								}
								size={28}
								color={accentForegroundColor}
							/>
						</View>
						<Text className='text-3xl font-bold text-foreground'>
							Добро пожаловать
						</Text>
						<Text className='mt-2 text-center text-base text-muted'>
							Войдите в аккаунт, чтобы продолжить
						</Text>
					</Animated.View>

					<Animated.View
						entering={FadeInDown.delay(120).duration(450)}
						className='gap-4'
					>
						<AuthInputField
							control={control}
							name='identifier'
							label='Email или username'
							leftIcon='mail-outline'
							isDisabled={isSubmitting}
							inputProps={{
								placeholder: 'you@example.com / username',
								autoCapitalize: 'none',
								autoComplete: 'username',
								textContentType: 'username',
								returnKeyType: 'next',
							}}
						/>

						<AuthInputField
							control={control}
							name='password'
							label='Пароль'
							leftIcon='lock-closed-outline'
							isDisabled={isSubmitting}
							rightSlot={
								<Pressable
									onPress={() => setIsPasswordVisible((prev) => !prev)}
									hitSlop={20}
									accessibilityRole='button'
									accessibilityLabel={
										isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'
									}
								>
									<Ionicons
										name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
										size={18}
										color={mutedColor}
									/>
								</Pressable>
							}
							inputProps={{
								placeholder: '••••••••',
								secureTextEntry: !isPasswordVisible,
								autoCapitalize: 'none',
								autoComplete: 'password',
								textContentType: 'password',
								returnKeyType: 'done',
								onSubmitEditing: handleSubmit(onSubmit),
							}}
						/>

						<View className='flex items-center'>
							<Button
								onPress={handleSubmit(onSubmit)}
								layout={LinearTransition.springify()}
								isDisabled={isSubmitting}
								isIconOnly={isSubmitting}
								className='mt-4 w-full'
							>
								{isSubmitting ? (
									<Spinner
										entering={FadeIn.delay(150)}
										color={accentForegroundColor}
									/>
								) : (
									'Войти'
								)}
							</Button>
						</View>
					</Animated.View>
				</ScrollView>
			</KeyboardAvoidingView>
		</BasePage>
	)
}
