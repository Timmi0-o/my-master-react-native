import { IActionErrorField } from '@/types/i-action.types'

interface IErrorResponse {
	message?: string
	errors?: IActionErrorField[]
	statusCode?: number
	timestamp?: string
	error?: string
}

export const ErrorObjectSetup = async (res: Response) => {
	if (res.ok) return

	let errorData

	try {
		const errorResponse = (await res.json()) as IErrorResponse

		const messagePart =
			typeof errorResponse.message === 'string'
				? errorResponse.message
						.split(',')
						.map((item: string) => item.trim())
						.join(', ')
				: ''
		const errorsPart =
			Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0
				? errorResponse.errors
						.map(
							(item: IActionErrorField) =>
								`Поле ${item.field}: ${item.message}`,
						)
						.join(', ')
				: ''
		const errorMessage = [messagePart, errorsPart]
			.filter(Boolean)
			.join(' ')
			.trim()

		errorData = {
			statusCode: errorResponse.statusCode ?? res.status,
			errors: errorResponse.errors,
			timestamp: errorResponse.timestamp ?? new Date().toISOString(),
			message: errorMessage || `Ошибка запроса (${res.status})`,
			error: errorResponse.error || res.statusText || 'Unknown Error',
		}
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: `Ошибка запроса (${res.status})`,
			error: res.statusText || 'Unknown Error',
		}
	}

	return { result: { data: null, success: false }, error: errorData }
}
