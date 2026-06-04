import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { IQueryObject } from '@/types/i-query-object'
import { IQueryFilterItemsConfig } from './types/i-query-filter-items-config'
import { formatQueryFromFilterItemsConfig } from './utils/format-query-from-filter-items-config'

export function formatQueryGetUsers(
	searchParams: Record<string, string>,
): IQueryObject {
	return formatQueryFromFilterItemsConfig(FILTER_ITEMS_CONFIG, searchParams)
}

const FILTER_ITEMS_CONFIG: IQueryFilterItemsConfig = {
	search: {
		fieldType: FieldTypes.SEARCH,
	},
	limit: {
		fieldType: FieldTypes.LIMIT,
	},
	page: {
		fieldType: FieldTypes.PAGE,
	},
	requiredIds: {
		fieldType: FieldTypes.REQUIRED_IDS,
	},
}
