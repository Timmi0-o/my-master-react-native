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
			message: errorResponse.error.message || `Ошибка запроса (${res.status})`,
		}
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: `Ошибка запроса (LOCAL APP ERROR) (${res.status})`,
		}
	}

	return { result: { data: null, success: false }, error: errorData }
}
