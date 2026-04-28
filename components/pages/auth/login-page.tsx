import { ILogin, LoginSchema } from '@/actions/auth/models/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	TextField,
} from 'heroui-native'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { FadeIn, LinearTransition } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LOGIN_FORM_DEFAULT_VALUES } from './data/login-form-default-values'
import { useOnSubmit } from './hooks/use-on-submit'

export default function LoginPage() {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ILogin>({
		resolver: zodResolver(LoginSchema),
		defaultValues: LOGIN_FORM_DEFAULT_VALUES,
		mode: 'onTouched',
	})

	const onSubmit = useOnSubmit()

	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<View className='flex-1 justify-center px-6'>
					<View className='mb-8'>
						<Text className='text-3xl font-bold text-foreground'>Вход</Text>
						<Text className='text-base text-muted-foreground mt-2'>
							Введите данные для входа в аккаунт
						</Text>
					</View>

					<View className='gap-4'>
						<Controller
							control={control}
							name='email'
							render={({ field: { value, onChange, onBlur } }) => (
								<TextField isRequired isInvalid={!!errors.email}>
									<Label>Email</Label>
									<Input
										placeholder='you@example.com'
										keyboardType='email-address'
										autoCapitalize='none'
										autoComplete='email'
										textContentType='emailAddress'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										editable={!isSubmitting}
									/>
									{errors.email?.message ? (
										<FieldError>{errors.email.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>

						<Controller
							control={control}
							name='password'
							render={({ field: { value, onChange, onBlur } }) => (
								<TextField isRequired isInvalid={!!errors.password}>
									<Label>Пароль</Label>
									<Input
										placeholder='••••••••'
										secureTextEntry
										autoCapitalize='none'
										autoComplete='password'
										textContentType='password'
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
										editable={!isSubmitting}
									/>
									{errors.password?.message ? (
										<FieldError>{errors.password.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>

						<View className='flex items-center justify-center'>
							<Button
								onPress={handleSubmit(onSubmit)}
								layout={LinearTransition.springify()}
								isDisabled={isSubmitting}
								className='w-full'
								isIconOnly={isSubmitting}
							>
								{isSubmitting ? (
									<Spinner entering={FadeIn.delay(150)} color='white' />
								) : (
									'Войти'
								)}
							</Button>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
