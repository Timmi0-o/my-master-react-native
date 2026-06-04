import { scopedT } from '@/configs/i18n/scoped-t'

interface IErrorResponse {
	error: {
		statusCode: number
		message: string
	}
	result: null
}

export const ErrorObjectSetup = async (res: Response) => {
	if (res.ok) return

	let errorData

	try {
		const errorResponse = (await res.json()) as IErrorResponse

		console.log('errorResponse', errorResponse)

		errorData = {
			statusCode: errorResponse.error.statusCode ?? res.status,
			timestamp: new Date().toISOString(),
			message:
				errorResponse.error.message ||
				scopedT('requestFailed', 'common', 'errors', { status: res.status }),
		}
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: scopedT('localAppError', 'common', 'errors', {
				status: res.status,
			}),
		}
	}

	return { result: { data: null, success: false }, error: errorData }
}
