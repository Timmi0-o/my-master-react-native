const INTERNAL_FILES_HOST_PATTERN = /^https?:\/\/files-minio:9010/
const S3_FILE_URL_PATTERN = /^s3:\/\/([^/]+)\/(.+)$/

const DEFAULT_PUBLIC_FILES_STORAGE_URL = 'http://localhost:9010'

const getPublicFilesStorageBase = (): string =>
	(
		process.env.EXPO_PUBLIC_FILES_STORAGE_URL ??
		DEFAULT_PUBLIC_FILES_STORAGE_URL
	).replace(/\/$/, '')

export const resolvePresignUrlForClient = (url: string): string =>
	url.replace(INTERNAL_FILES_HOST_PATTERN, getPublicFilesStorageBase())

export const resolveFileUrlForClient = (fileUrl: string): string | null => {
	const normalizedUrl = fileUrl.trim()

	if (!normalizedUrl) {
		return null
	}

	if (normalizedUrl.includes('X-Amz-Signature=')) {
		return resolvePresignUrlForClient(normalizedUrl)
	}

	const s3Match = normalizedUrl.match(S3_FILE_URL_PATTERN)

	if (s3Match) {
		const [, bucket, objectKey] = s3Match
		return `${getPublicFilesStorageBase()}/${bucket}/${objectKey}`
	}

	if (
		normalizedUrl.startsWith('http://') ||
		normalizedUrl.startsWith('https://') ||
		normalizedUrl.startsWith('/')
	) {
		return resolvePresignUrlForClient(normalizedUrl)
	}

	return null
}
