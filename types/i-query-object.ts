import { IQueryField } from '@/actions/base-models/filters/base-query-field.schema'

export type IQueryFilterObject = Record<string, IQueryField | IQueryField[]>

export type IQueryObject =
	| (Record<string, IQueryField | IQueryField[]> & {
			filter?: IQueryFilterObject
	  })
	| undefined
