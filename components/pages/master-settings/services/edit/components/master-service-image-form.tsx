import {
	masterServicesDeleteImages,
	masterServicesNewImageGetPresignUrl,
} from '@/actions/master-service/actions'
import type { IMasterServiceImage } from '@/actions/master-service/models/master-service.schema'
import {
	ILocalImageAsset,
	IMasterServiceImageEdit,
	MasterServiceImageEditSchema,
} from '@/actions/master-service/models/master-service-edit-image.schema'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { SaveButton } from '@/components/shared/ui/save-button/save-button'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useUploadFileToS3 } from '@/hooks/use-upload-file-to-s3'
import { getSha256SumFromFile } from '@/utils/get-sha256-sum-from-file.util'
import { resolveFileUrlForClient } from '@/utils/resolve-file-url-for-client.util'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { Button, useToast } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'

interface IMasterServiceImageFormProps {
	images: IMasterServiceImage[]
	masterServiceId: string
}

const resolveFileIdsToDelete = (
	deleteImageIds: string[],
	images: IMasterServiceImage[],
): string[] => {
	const imagesById = new Map(images.map((image) => [image.id, image]))

	return deleteImageIds.flatMap((imageId) => {
		const fileId = imagesById.get(imageId)?.fileId
		return fileId ? [fileId] : []
	})
}

export function MasterServiceImageForm({
	images,
	masterServiceId,
}: IMasterServiceImageFormProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { toast } = useToast()
	const { uploadFile } = useUploadFileToS3()
	const [deleteIds, setDeleteIds] = useState<string[]>([])
	const [newImages, setNewImages] = useState<ILocalImageAsset[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const pickImages = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsMultipleSelection: true,
			quality: 0.9,
		})

		if (result.canceled) return

		const assets: ILocalImageAsset[] = result.assets.map(
			(asset: ImagePicker.ImagePickerAsset, index: number) => ({
			uri: asset.uri,
			name: asset.fileName ?? `image-${Date.now()}-${index}.jpg`,
			mimeType: asset.mimeType ?? 'image/jpeg',
		}))

		setNewImages((prev) => [...prev, ...assets])
	}

	const toggleDelete = (imageId: string) => {
		setDeleteIds((prev) =>
			prev.includes(imageId)
				? prev.filter((id) => id !== imageId)
				: [...prev, imageId],
		)
	}

	const onSubmit = async () => {
		const payload: IMasterServiceImageEdit = { deleteIds, newImages }
		const validated = MasterServiceImageEditSchema.safeParse(payload)

		if (!validated.success) {
			toast.show({
				variant: 'danger',
				label: validated.error.issues[0]?.message ?? 'Validation error',
			})
			return
		}

		if (validated.data.newImages.length === 0 && validated.data.deleteIds.length === 0) {
			return
		}

		setIsSubmitting(true)

		try {
			const fileIdsToDelete = resolveFileIdsToDelete(
				validated.data.deleteIds,
				images,
			)

			if (fileIdsToDelete.length > 0) {
				const deleteResponse = await masterServicesDeleteImages(
					masterServiceId,
					{ fileIds: fileIdsToDelete },
				)

				if (deleteResponse.error) {
					throw new Error(deleteResponse.error.message)
				}
			}

			if (validated.data.newImages.length > 0) {
				const filesWithChecksum = await Promise.all(
					validated.data.newImages.map(async (file) => ({
						file,
						sha256sum: await getSha256SumFromFile(file.uri),
					})),
				)

				const presignResponse = await masterServicesNewImageGetPresignUrl(
					masterServiceId,
					{
						files: filesWithChecksum.map(({ file, sha256sum }) => ({
							name: file.name,
							sha256sum,
						})),
					},
				)

				if (presignResponse.error) {
					throw new Error(presignResponse.error.message)
				}

				const presignedFiles = presignResponse.result?.data ?? []
				const presignedByName = new Map(
					presignedFiles.map((item) => [item.name, item]),
				)

				for (const { file } of filesWithChecksum) {
					const presigned = presignedByName.get(file.name)
					if (!presigned?.url) continue

					const uploadResponse = await uploadFile({
						uri: file.uri,
						presignUrl: presigned.url,
						contentType: file.mimeType,
					})

					if (!uploadResponse.ok) {
						throw new Error(`Upload failed for ${file.name}`)
					}
				}
			}

			setDeleteIds([])
			setNewImages([])
			toast.show({
				variant: 'success',
				label: scopedT('imagesSaved', 'common', 'toasts.masterService'),
			})
		} catch (error) {
			toast.show({
				variant: 'danger',
				label: scopedT('imagesSaveFailed', 'common', 'toasts.masterService'),
				description: error instanceof Error ? error.message : undefined,
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const hasPhotos = images.length > 0 || newImages.length > 0

	return (
		<View className='gap-4'>
			<Button onPress={pickImages} variant='secondary'>
				<Ionicons name='image-outline' size={18} />
				<Button.Label>{t('addPhotos')}</Button.Label>
			</Button>

			{!hasPhotos ? (
				<DataNotFound message={t('emptyPhotos')} />
			) : (
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View className='flex-row gap-3'>
						{newImages.map((asset) => (
							<Image
								key={asset.uri}
								source={{ uri: asset.uri }}
								style={{ width: 120, height: 120, borderRadius: 12 }}
							/>
						))}
						{images.map((image) => {
							const uri = resolveFileUrlForClient(image.file?.fileUrl ?? '')
							const isMarked = deleteIds.includes(image.id)

							return (
								<Pressable key={image.id} onPress={() => toggleDelete(image.id)}>
									{uri ? (
										<Image
											source={{ uri }}
											style={{
												width: 120,
												height: 120,
												borderRadius: 12,
												opacity: isMarked ? 0.4 : 1,
											}}
										/>
									) : null}
								</Pressable>
							)
						})}
					</View>
				</ScrollView>
			)}

			{(deleteIds.length > 0 || newImages.length > 0) && (
				<SaveButton onPress={onSubmit} isLoading={isSubmitting} />
			)}
		</View>
	)
}
