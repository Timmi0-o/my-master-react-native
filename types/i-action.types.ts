export interface IActionErrorField {
	field: string
	message: string
}

export interface IActionError {
	statusCode: number
	timestamp: string
	error: string
	message: string
	errors?: IActionErrorField[]
}

export interface IActionResult<T> {
	data: T
	success?: boolean
}

export interface IActionResponse<T> {
	result: IActionResult<T>
	error?: IActionError
}

export interface IHttpParams<T = unknown> {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	headers?: Record<string, string>
	body?: T
}

export interface IMutateActionOptions<T> {
	url: string
	params?: IHttpParams<T>
	json?: boolean
	isPublic?: boolean
	onOk?: () => void
}

export interface IGetActionOptions {
	url: string
	params?: IHttpParams
	filters?: Record<string, unknown>
	customFormatter?: (
		filters: Record<string, unknown>,
	) => Record<string, string> | undefined
}
