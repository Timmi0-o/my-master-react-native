import { IQueryField } from '@/actions/base-models/filters/base-query-field.schema'

export type { IGetActionPresets } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'

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

interface IBaseActionOptions {
	url: string
	params?: IHttpParams
}

export interface IMutateActionOptions extends IBaseActionOptions {
	json?: boolean
	isPublic?: boolean
	onOk?: () => void
}

export type IActionFilters<T> = Partial<T>

export interface IGetActionOptions<
	TFilters = Record<string, IQueryField>,
> extends Partial<IBaseActionOptions> {
	filters?: IActionFilters<TFilters>
	customFormatter?: (
		filters: IActionFilters<TFilters>,
	) => Record<string, string> | undefined
}
