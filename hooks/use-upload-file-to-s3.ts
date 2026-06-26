import { getSha256SumFromFile } from '@/utils/get-sha256-sum-from-file.util'
import { resolvePresignUrlForClient } from '@/utils/resolve-file-url-for-client.util'

interface IUploadFileToS3Params {
	uri: string
	contentType: string
	presignUrl: string
}

export const useUploadFileToS3 = () => {
	const uploadFile = async ({
		uri,
		contentType,
		presignUrl,
	}: IUploadFileToS3Params) => {
		const uploadUrl = resolvePresignUrlForClient(presignUrl)
		const checksum = await getSha256SumFromFile(uri)
		const fileResponse = await fetch(uri)
		const blob = await fileResponse.blob()

		return fetch(uploadUrl, {
			method: 'PUT',
			body: blob,
			headers: {
				'Content-Type': contentType,
				'X-Amz-Checksum-Sha256': checksum,
			},
		})
	}

	return { uploadFile }
}
