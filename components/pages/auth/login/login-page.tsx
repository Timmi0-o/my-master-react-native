import {
	createLoginSchema,
	type ILogin,
} from '@/actions/auth/models/login.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useAppLocale } from '@/configs/i18n/locale-context'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Spinner, useThemeColor } from 'heroui-native'
import { ReactElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, Text, View } from 'react-native'
import Animated, {
	FadeIn,
	FadeInDown,
	LinearTransition,
} from 'react-native-reanimated'
import { AuthInputField } from './components/auth-input-field'
import { LOGIN_FORM_DEFAULT_VALUES } from './data/login-form-default-values'
import { useOnSubmit } from './hooks/use-on-submit'

export default function LoginPage(): ReactElement {
	const { locale } = useAppLocale()
	const { t: tAuth } = useScopedTranslation('pages', 'auth.login')
	const { t: tUi } = useScopedTranslation('ui')
	const loginSchema = useMemo(() => createLoginSchema(), [locale])

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ILogin>({
		resolver: zodResolver(loginSchema),
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
		<BasePage
			style={{ paddingHorizontal: 8 }}
			contentContainerStyle={{ justifyContent: 'center' }}
			adjustForKeyboard
		>
			<Animated.View
				entering={FadeInDown.duration(450)}
				style={{ marginBottom: 20, alignItems: 'center' }}
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
						name={isSubmitting ? 'lock-open-outline' : 'lock-closed-outline'}
						size={28}
						color={accentForegroundColor}
					/>
				</View>
				<Text className='text-3xl font-bold text-foreground'>
					{tAuth('title')}
				</Text>
				<Text className='mt-2 text-center text-base text-muted'>
					{tAuth('subtitle')}
				</Text>
			</Animated.View>

			<Card>
				<Card.Body>
					<Animated.View
						entering={FadeInDown.delay(120).duration(450)}
						className='gap-4'
					>
						<AuthInputField
							control={control}
							name='email'
							label={tAuth('emailLabel')}
							leftIcon='mail-outline'
							isDisabled={isSubmitting}
							inputProps={{
								placeholder: tUi('placeholder.loginEmail'),
								autoCapitalize: 'none',
								autoComplete: 'email',
								textContentType: 'emailAddress',
								keyboardType: 'email-address',
								returnKeyType: 'next',
							}}
						/>

						<AuthInputField
							control={control}
							name='password'
							label={tAuth('passwordLabel')}
							leftIcon='lock-closed-outline'
							isDisabled={isSubmitting}
							rightSlot={
								<Pressable
									onPress={() => setIsPasswordVisible((prev) => !prev)}
									hitSlop={20}
									accessibilityRole='button'
									accessibilityLabel={
										isPasswordVisible
											? tUi('accessibility.hidePassword')
											: tUi('accessibility.showPassword')
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
								placeholder: tUi('placeholder.loginPassword'),
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
									tUi('button.login')
								)}
							</Button>
						</View>
					</Animated.View>
				</Card.Body>
			</Card>
		</BasePage>
	)
}
