import {
	ILocalImageAsset,
	IMasterServiceImageEdit,
	IMasterServiceImageEditPayload,
	MasterServiceImageEditSchema,
} from '@/actions/master-service/models/master-service-edit-image.schema'
import type { IMasterServiceImage } from '@/actions/master-service/models/master-service.schema'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ImagePickerAsset } from 'expo-image-picker'
import { Button, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useOnSubmitMasterServiceImageForm } from '../../hooks/use-on-submit-master-service-image-form'
import { ExistingImageTile } from './components/existing-image-tile'
import { NewImageTile } from './components/new-image-tile'
import { toggleDeleteId } from './utils/toggle-delete-id'

interface IMasterServiceImageFormProps {
	images: IMasterServiceImage[]
	masterServiceId: string
}

export function MasterServiceImageForm({
	images,
	masterServiceId,
}: IMasterServiceImageFormProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')

	const accentColor = useThemeColor('accent')

	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty, isSubmitting },
	} = useForm<IMasterServiceImageEdit, unknown, IMasterServiceImageEditPayload>(
		{
			resolver: zodResolver(MasterServiceImageEditSchema),
			defaultValues: {
				deleteIds: [],
				newImages: [],
			},
		},
	)

	const { onSubmit } = useOnSubmitMasterServiceImageForm(
		masterServiceId,
		images,
		reset,
	)

	const pickImages = async (
		onChange: (value: ILocalImageAsset[]) => void,
		currentImages: ILocalImageAsset[],
	) => {
		const ImagePicker = await import('expo-image-picker')

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsMultipleSelection: true,
			quality: 0.9,
		})

		if (result.canceled) return

		const assets: ILocalImageAsset[] = result.assets.map(
			(asset: ImagePickerAsset, index: number) => ({
				uri: asset.uri,
				name: asset.fileName ?? `image-${Date.now()}-${index}.jpg`,
				mimeType: asset.mimeType ?? 'image/jpeg',
			}),
		)

		onChange([...currentImages, ...assets])
	}

	return (
		<View className='gap-4'>
			<Controller
				control={control}
				name='newImages'
				render={({ field: newImagesField }) => (
					<Controller
						control={control}
						name='deleteIds'
						render={({ field: deleteIdsField }) => {
							const hasPhotos =
								images.length > 0 || newImagesField.value.length > 0

							return (
								<View className='gap-4'>
									{hasPhotos ? (
										<View className='flex-row flex-wrap gap-3'>
											{newImagesField.value.map((asset) => (
												<NewImageTile
													key={`${asset.uri}-${asset.name}`}
													asset={asset}
													onRemove={() => {
														newImagesField.onChange(
															newImagesField.value.filter(
																(item) => item.uri !== asset.uri,
															),
														)
													}}
												/>
											))}

											{images.map((image) => (
												<ExistingImageTile
													key={image.id}
													image={image}
													isMarkedForDelete={deleteIdsField.value.includes(
														image.id,
													)}
													onToggleDelete={() => {
														deleteIdsField.onChange(
															toggleDeleteId(deleteIdsField.value, image.id),
														)
													}}
												/>
											))}
										</View>
									) : (
										<DataNotFound message={t('emptyPhotos')} />
									)}
									<Button
										onPress={() =>
											void pickImages(
												newImagesField.onChange,
												newImagesField.value,
											)
										}
										variant='secondary'
									>
										<Ionicons
											name='image-outline'
											size={18}
											color={accentColor}
										/>

										<Button.Label>{t('addPhotos')}</Button.Label>
									</Button>
								</View>
							)
						}}
					/>
				)}
			/>

			{isDirty ? (
				<SaveButton isLoading={isSubmitting} onPress={handleSubmit(onSubmit)} />
			) : null}
		</View>
	)
}
