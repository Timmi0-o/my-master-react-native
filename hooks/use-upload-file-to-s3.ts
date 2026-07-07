import { getSha256SumFromFile } from '@/utils/get-sha256-sum-from-file.util'
import { resolvePresignUrlForClient } from '@/utils/resolve-file-url-for-client.util'
import { File, UploadType } from 'expo-file-system'

interface IUploadFileToS3Params {
	uri: string
	contentType: string
	presignUrl: string
}

interface IUploadFileToS3Result {
	ok: boolean
	status: number
	body: string
}

export const useUploadFileToS3 = () => {
	const uploadFile = async ({
		uri,
		contentType,
		presignUrl,
	}: IUploadFileToS3Params): Promise<IUploadFileToS3Result> => {
		const uploadUrl = resolvePresignUrlForClient(presignUrl)
		const checksum = await getSha256SumFromFile(uri)
		const file = new File(uri)

		const result = await file.upload(uploadUrl, {
			httpMethod: 'PUT',
			uploadType: UploadType.BINARY_CONTENT,
			mimeType: contentType,
			headers: {
				'Content-Type': contentType,
				'X-Amz-Checksum-Sha256': checksum,
			},
		})

		return {
			ok: result.status >= 200 && result.status < 300,
			status: result.status,
			body: result.body,
		}
	}

	return { uploadFile }
}
