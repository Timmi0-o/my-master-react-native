import {
	masterServicesDeleteImages,
	masterServicesNewImageGetPresignUrl,
} from '@/actions/master-service/actions'
import {
	IMasterServiceImageEdit,
	MasterServiceImageEditSchema,
} from '@/actions/master-service/models/master-service-edit-image.schema'
import type { IMasterServiceImage } from '@/actions/master-service/models/master-service.schema'
import { scopedT } from '@/configs/i18n/scoped-t'
import { useUploadFileToS3 } from '@/hooks/use-upload-file-to-s3'
import { getSha256SumFromFile } from '@/utils/get-sha256-sum-from-file.util'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from 'heroui-native'
import type { UseFormReset } from 'react-hook-form'

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

export function useOnSubmitMasterServiceImageForm(
	masterServiceId: string,
	images: IMasterServiceImage[],
	reset: UseFormReset<IMasterServiceImageEdit>,
) {
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const { uploadFile } = useUploadFileToS3()

	const onSubmit = async (payload: IMasterServiceImageEdit): Promise<void> => {
		const validated = MasterServiceImageEditSchema.safeParse(payload)

		console.log('validated', validated)

		if (!validated.success) {
			const firstMessage = validated.error.issues[0]?.message

			if (firstMessage) {
				toast.show({
					variant: 'danger',
					label: firstMessage,
				})
			}

			return
		}

		const { newImages, deleteIds } = validated.data

		if (newImages.length === 0 && deleteIds.length === 0) {
			return
		}

		const fileIdsToDelete = resolveFileIdsToDelete(deleteIds, images)

		if (deleteIds.length > 0 && fileIdsToDelete.length !== deleteIds.length) {
			toast.show({
				variant: 'danger',
				label: scopedT('imagesSaveFailed', 'common', 'toasts.masterService'),
			})
			return
		}

		try {
			if (fileIdsToDelete.length > 0) {
				const deleteResponse = await masterServicesDeleteImages(
					masterServiceId,
					{ fileIds: fileIdsToDelete },
				)

				if (deleteResponse.error) {
					throw new Error(deleteResponse.error.message)
				}
			}

			if (newImages.length > 0) {
				const filesWithChecksum = await Promise.all(
					newImages.map(async (file) => ({
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

				console.log('presignResponse', presignResponse)

				if (presignResponse.error) {
					throw new Error(presignResponse.error.message)
				}

				const presignedFiles = presignResponse.result?.data ?? []

				if (presignedFiles.length !== filesWithChecksum.length) {
					throw new Error(
						scopedT('imagesSaveFailed', 'common', 'toasts.masterService'),
					)
				}

				const presignedByName = new Map(
					presignedFiles.map((item) => [item.name, item]),
				)

				for (const { file } of filesWithChecksum) {
					const presigned = presignedByName.get(file.name)

					if (!presigned?.url) {
						throw new Error(
							scopedT('imagesSaveFailed', 'common', 'toasts.masterService'),
						)
					}

					const uploadResponse = await uploadFile({
						uri: file.uri,
						presignUrl: presigned.url,
						contentType: file.mimeType,
					})

					if (!uploadResponse.ok) {
						throw new Error(
							`Upload failed with status ${uploadResponse.status}${uploadResponse.body ? `: ${uploadResponse.body}` : ''}`,
						)
					}
				}
			}

			reset({ deleteIds: [], newImages: [] })
			await queryClient.invalidateQueries({ queryKey: ['master-services'] })

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
		}
	}

	return { onSubmit }
}
