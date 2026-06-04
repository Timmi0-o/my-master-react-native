import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { IQueryObject } from '@/types/i-query-object'
import { IQueryFilterItemsConfig } from './types/i-query-filter-items-config'
import { formatQueryFromFilterItemsConfig } from './utils/format-query-from-filter-items-config'

export function formatQueryGetMasterServices(
	searchParams: Record<string, string>,
): IQueryObject {
	return formatQueryFromFilterItemsConfig(FILTER_ITEMS_CONFIG, searchParams)
}

const FILTER_ITEMS_CONFIG: IQueryFilterItemsConfig = {
	page: {
		fieldType: FieldTypes.PAGE,
	},
	limit: {
		fieldType: FieldTypes.LIMIT,
	},
	orderField: {
		fieldType: FieldTypes.STRING,
	},
	orderDir: {
		fieldType: FieldTypes.STRING,
	},
	requiredIds: {
		fieldType: FieldTypes.REQUIRED_IDS,
	},
	search: {
		fieldType: FieldTypes.SEARCH,
	},
}
