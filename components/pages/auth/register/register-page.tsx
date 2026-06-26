import {
	createRegisterSchema,
	type IRegister,
} from '@/actions/auth/models/login.schema'
import { AuthInputField } from '@/components/pages/auth/login/components/auth-input-field'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useAppLocale } from '@/configs/i18n/locale-context'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Spinner } from 'heroui-native'
import { Link } from 'expo-router'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, Text, View } from 'react-native'
import { useOnSubmitRegister } from './hooks/use-on-submit-register'

const DEFAULT_VALUES: IRegister = {
	email: '',
	username: '',
	password: '',
}

export default function RegisterPage(): ReactElement {
	const { locale } = useAppLocale()
	const { t } = useScopedTranslation('pages', 'auth.register')
	const { t: tUi } = useScopedTranslation('ui')
	const registerSchema = useMemo(() => createRegisterSchema(), [locale])
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<IRegister>({
		resolver: zodResolver(registerSchema),
		defaultValues: DEFAULT_VALUES,
		mode: 'onTouched',
	})

	const onSubmit = useOnSubmitRegister()

	return (
		<BasePage style={{ paddingHorizontal: 8 }} adjustForKeyboard>
			<Card>
				<Card.Body className='gap-4'>
					<Text className='text-2xl font-bold text-foreground'>{t('title')}</Text>
					<Text className='text-muted'>{t('subtitle')}</Text>

					<AuthInputField
						control={control}
						name='email'
						label={t('emailLabel')}
						leftIcon='mail-outline'
						isDisabled={isSubmitting}
						inputProps={{
							keyboardType: 'email-address',
							autoCapitalize: 'none',
						}}
					/>
					<AuthInputField
						control={control}
						name='username'
						label={t('usernameLabel')}
						leftIcon='person-outline'
						isDisabled={isSubmitting}
						inputProps={{ autoCapitalize: 'none' }}
					/>
					<AuthInputField
						control={control}
						name='password'
						label={t('passwordLabel')}
						leftIcon='lock-closed-outline'
						isDisabled={isSubmitting}
						rightSlot={
							<Pressable onPress={() => setIsPasswordVisible((v) => !v)}>
								<Text className='text-sm text-accent'>
									{isPasswordVisible
										? tUi('accessibility.hidePassword')
										: tUi('accessibility.showPassword')}
								</Text>
							</Pressable>
						}
						inputProps={{ secureTextEntry: !isPasswordVisible }}
					/>

					<Button
						onPress={handleSubmit(onSubmit)}
						isDisabled={isSubmitting}
						className='w-full'
					>
						{isSubmitting ? <Spinner /> : tUi('button.register')}
					</Button>

					<Link href='/(auth)/sign-in' asChild>
						<Pressable>
							<Text className='text-center text-accent'>{t('signInLink')}</Text>
						</Pressable>
					</Link>
				</Card.Body>
			</Card>
		</BasePage>
	)
}
