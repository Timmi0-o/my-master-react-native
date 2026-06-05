import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { IMasterServicesGetManyFilters } from '@/actions/master-service/models/master-service-filter.schema'
import { IQueryObject, IRawSearchParams } from '@/types/i-query-object'
import { IQueryFilterItemsConfig } from './types/i-query-filter-items-config'
import { formatQueryFromFilterItemsConfig } from './utils/format-query-from-filter-items-config'

export function formatQueryGetMasterServices(
	searchParams: IRawSearchParams,
): IQueryObject {
	return formatQueryFromFilterItemsConfig(FILTER_ITEMS_CONFIG, searchParams)
}

const FILTER_ITEMS_CONFIG: IQueryFilterItemsConfig<IMasterServicesGetManyFilters> = {
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
