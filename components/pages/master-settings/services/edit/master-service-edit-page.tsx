import {
	IMasterServiceEdit,
	IMasterServiceEditPayload,
	MasterServiceEditSchema,
} from '@/actions/master-service/models/master-service-edit.schema'
import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { GlassInput } from '@/components/shared/ui/glass-input/glass-input'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceUpdate } from '@/hooks/actions/master-service/use-master-service-update'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { Card, FieldError, Label, Tabs, TextField } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { MasterServiceEditHeader } from './components/master-service-edit-header'
import { MasterServiceImageForm } from './components/master-service-image-form'

const buildDefaultValues = (service: IMasterService): IMasterServiceEdit => ({
	id: service.id,
	name: service.name,
	description: service.description,
	price: String(service.price),
	durationMinutes: String(service.durationMinutes),
})

function EditMasterServiceForm({
	service,
}: {
	service: IMasterService
}): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const router = useRouter()
	const updateMutation = useMasterServiceUpdate(service.id)

	const { control, handleSubmit } = useForm<
		IMasterServiceEdit,
		unknown,
		IMasterServiceEditPayload
	>({
		resolver: zodResolver(MasterServiceEditSchema),
		defaultValues: buildDefaultValues(service),
		mode: 'onTouched',
	})

	const onSubmit = async (payload: IMasterServiceEditPayload) => {
		await updateMutation.mutateAsync(payload)
		router.back()
	}

	return (
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
				isLoading={updateMutation.isPending}
			/>
		</View>
	)
}

export function MasterServiceEditPage({
	service,
}: {
	service: IMasterService
}): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const [activeTab, setActiveTab] = useState<'main' | 'images'>('main')

	const tabs: { value: 'main' | 'images'; label: string }[] = [
		{ value: 'main', label: t('serviceEditMainTab') },
		{ value: 'images', label: t('serviceEditImagesTab') },
	]

	const handleTabChange = (value: string): void => {
		if (value === 'main' || value === 'images') {
			setActiveTab(value)
		}
	}

	return (
		<BasePage adjustForKeyboard>
			<MasterServiceEditHeader title={t('serviceEditTitle')} />
			<Tabs
				className='gap-4'
				onValueChange={handleTabChange}
				value={activeTab}
				variant='primary'
			>
				<Tabs.List className='w-full self-stretch'>
					<Tabs.Indicator />
					{tabs.map((tab) => (
						<Tabs.Trigger key={tab.value} className='flex-1' value={tab.value}>
							<Tabs.Label className='text-sm' numberOfLines={1}>
								{tab.label}
							</Tabs.Label>
						</Tabs.Trigger>
					))}
				</Tabs.List>

				<Tabs.Content value='main'>
					<Card>
						<Card.Body>
							<EditMasterServiceForm service={service} />
						</Card.Body>
					</Card>
				</Tabs.Content>

				<Tabs.Content value='images'>
					<MasterServiceImageForm
						images={service.images ?? []}
						masterServiceId={service.id}
					/>
				</Tabs.Content>
			</Tabs>
		</BasePage>
	)
}
