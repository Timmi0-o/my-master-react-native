import { requestResetPassword } from '@/actions/auth/actions'
import { AuthInputField } from '@/components/pages/auth/login/components/auth-input-field'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { scopedT } from '@/configs/i18n/scoped-t'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { Button, Card, Spinner, useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, Text } from 'react-native'
import { z } from 'zod'

const schema = z.object({
	email: z.string().email(),
})

type IForgotPasswordForm = z.infer<typeof schema>

export default function ForgotPasswordPage(): ReactElement {
	const { t } = useScopedTranslation('pages', 'auth.forgotPassword')
	const { t: tUi } = useScopedTranslation('ui')
	const router = useRouter()
	const { toast } = useToast()

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<IForgotPasswordForm>({
		resolver: zodResolver(schema),
		defaultValues: { email: '' },
	})

	const onSubmit = async (data: IForgotPasswordForm) => {
		const res = await requestResetPassword({ email: data.email })

		if (res.error) {
			toast.show({
				variant: 'danger',
				label: scopedT('resetRequestFailed', 'common', 'toasts.auth'),
				description: res.error.message,
			})
			return
		}

		toast.show({
			variant: 'success',
			label: scopedT('resetRequestSuccess', 'common', 'toasts.auth'),
		})
		router.push('/(auth)/reset-password')
	}

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

					<Button
						onPress={handleSubmit(onSubmit)}
						isDisabled={isSubmitting}
						className='w-full'
					>
						{isSubmitting ? <Spinner /> : tUi('button.send')}
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
