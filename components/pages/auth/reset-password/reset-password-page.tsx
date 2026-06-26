import {
	resetPassword,
	validateResetPasswordToken,
} from '@/actions/auth/actions'
import { AuthInputField } from '@/components/pages/auth/login/components/auth-input-field'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { scopedT } from '@/configs/i18n/scoped-t'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Button, Card, Spinner, useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, Text } from 'react-native'
import { z } from 'zod'

const schema = z
	.object({
		token: z.string().min(1),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: scopedT('passwordsMismatch', 'common', 'validation.auth'),
	})

type IResetPasswordForm = z.infer<typeof schema>

export default function ResetPasswordPage(): ReactElement {
	const { t } = useScopedTranslation('pages', 'auth.resetPassword')
	const { t: tUi } = useScopedTranslation('ui')
	const router = useRouter()
	const { toast } = useToast()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<IResetPasswordForm>({
		resolver: zodResolver(schema),
		defaultValues: { token: '', password: '', confirmPassword: '' },
	})

	const onSubmit = async (data: IResetPasswordForm) => {
		const validateRes = await validateResetPasswordToken(data.token)

		if (validateRes.error) {
			toast.show({
				variant: 'danger',
				label: scopedT('resetTokenInvalid', 'common', 'toasts.auth'),
				description: validateRes.error.message,
			})
			return
		}

		const res = await resetPassword({
			token: data.token,
			password: data.password,
			confirmPassword: data.confirmPassword,
		})

		if (res.error) {
			toast.show({
				variant: 'danger',
				label: scopedT('resetFailed', 'common', 'toasts.auth'),
				description: res.error.message,
			})
			return
		}

		toast.show({
			variant: 'success',
			label: scopedT('resetSuccess', 'common', 'toasts.auth'),
		})
		router.replace('/(auth)/sign-in')
	}

	return (
		<BasePage style={{ paddingHorizontal: 8 }} adjustForKeyboard>
			<Card>
				<Card.Body className='gap-4'>
					<Text className='text-2xl font-bold text-foreground'>{t('title')}</Text>
					<Text className='text-muted'>{t('subtitle')}</Text>

					<AuthInputField
						control={control}
						name='token'
						label={t('tokenLabel')}
						leftIcon='key-outline'
						isDisabled={isSubmitting}
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
					<AuthInputField
						control={control}
						name='confirmPassword'
						label={t('confirmPasswordLabel')}
						leftIcon='lock-closed-outline'
						isDisabled={isSubmitting}
						inputProps={{ secureTextEntry: !isPasswordVisible }}
					/>

					<Button
						onPress={handleSubmit(onSubmit)}
						isDisabled={isSubmitting}
						className='w-full'
					>
						{isSubmitting ? <Spinner /> : tUi('button.save')}
					</Button>

					<Link href='/(auth)/sign-in' asChild>
						<Pressable>
							<Text className='text-center text-accent'>{t('backToSignIn')}</Text>
						</Pressable>
					</Link>
				</Card.Body>
			</Card>
		</BasePage>
	)
}
