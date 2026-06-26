import { IQueryField } from '@/actions/base-models/filters/base-query-field.schema'
import { IAppActionResponse } from '@/contracts/api-response/types'

export type { IGetActionPresets } from '@/actions/base-models/filters/filter-fields/base-preset-filter.schema'

/** @deprecated Use IAppActionResponse from contracts/api-response/types */
export type IActionResponse<T> = IAppActionResponse<T>

export interface IHttpParams<T = unknown> {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
	headers?: Record<string, string>
	body?: T
}

interface IBaseActionOptions {
	url: string
	params?: IHttpParams
}

export interface IMutateActionOptions<TBody = unknown> extends IBaseActionOptions {
	params?: IHttpParams & { body?: TBody }
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
	isArray?: boolean
	isPublic?: boolean
}
