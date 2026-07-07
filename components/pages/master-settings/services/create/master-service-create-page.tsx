import {
	IMasterServiceCreate,
	IMasterServiceCreatePayload,
	MasterServiceCreateSchema,
} from '@/actions/master-service/models/master-service-create.schema'
import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceCreate } from '@/hooks/actions/master-service/use-master-service-create'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Card, FieldError, Label, TextField } from 'heroui-native'
import type { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { MasterServiceEditHeader } from '../edit/components/master-service-edit-header'

const buildDefaultValues = (masterProfileId: string): IMasterServiceCreate => ({
	masterProfileId,
	name: '',
	description: '',
	price: '',
	durationMinutes: '60',
})

interface IMasterServiceCreatePageProps {
	masterProfile: IMasterProfile
}

export function MasterServiceCreatePage({
	masterProfile,
}: IMasterServiceCreatePageProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const router = useRouter()
	const createMutation = useMasterServiceCreate()

	const { control, handleSubmit } = useForm<
		IMasterServiceCreate,
		unknown,
		IMasterServiceCreatePayload
	>({
		resolver: zodResolver(MasterServiceCreateSchema),
		defaultValues: buildDefaultValues(masterProfile.id),
		mode: 'onTouched',
	})

	const onSubmit = async (payload: IMasterServiceCreatePayload) => {
		const created = await createMutation.mutateAsync(payload)

		if (!created?.id) {
			return
		}

		router.replace({
			pathname: '/master-settings/services/edit',
			params: { id: created.id },
		})
	}

	return (
		<BasePage adjustForKeyboard>
			<MasterServiceEditHeader title={t('serviceCreateTitle')} />
			<Card>
				<Card.Body>
					<View className='gap-4'>
						<Controller
							control={control}
							name='name'
							render={({ field, fieldState }) => (
								<TextField isInvalid={!!fieldState.error}>
									<Label>{t('tableColumnName')}</Label>
									<GlassInput
										value={field.value}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
									/>
									{fieldState.error?.message ? (
										<FieldError>{fieldState.error.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name='description'
							render={({ field, fieldState }) => (
								<TextField isInvalid={!!fieldState.error}>
									<Label>{t('tableColumnDescription')}</Label>
									<GlassInput
										value={field.value}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
										multiline
									/>
									{fieldState.error?.message ? (
										<FieldError>{fieldState.error.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name='price'
							render={({ field, fieldState }) => (
								<TextField isInvalid={!!fieldState.error}>
									<Label>{t('tableColumnPrice')}</Label>
									<GlassInput
										value={field.value}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
										keyboardType='decimal-pad'
									/>
									{fieldState.error?.message ? (
										<FieldError>{fieldState.error.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>
						<Controller
							control={control}
							name='durationMinutes'
							render={({ field, fieldState }) => (
								<TextField isInvalid={!!fieldState.error}>
									<Label>{t('tableColumnDuration')}</Label>
									<GlassInput
										value={field.value}
										onChangeText={field.onChange}
										onBlur={field.onBlur}
										keyboardType='number-pad'
									/>
									{fieldState.error?.message ? (
										<FieldError>{fieldState.error.message}</FieldError>
									) : null}
								</TextField>
							)}
						/>
						<SaveButton
							onPress={handleSubmit(onSubmit)}
							isLoading={createMutation.isPending}
						/>
					</View>
				</Card.Body>
			</Card>
		</BasePage>
	)
}
