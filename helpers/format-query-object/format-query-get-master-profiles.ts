import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { IMasterProfilesGetManyFilters } from '@/actions/master/models/master-profile-filter.schema'
import { IQueryObject, IRawSearchParams } from '@/types/i-query-object'
import { IQueryFilterItemsConfig } from './types/i-query-filter-items-config'
import { formatQueryFromFilterItemsConfig } from './utils/format-query-from-filter-items-config'

export function formatQueryGetMasterProfiles(
	searchParams: IRawSearchParams,
): IQueryObject {
	return formatQueryFromFilterItemsConfig(FILTER_ITEMS_CONFIG, searchParams)
}

const FILTER_ITEMS_CONFIG: IQueryFilterItemsConfig<
	NonNullable<IMasterProfilesGetManyFilters>
> = {
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
	filter: {
		search: {
			fieldType: FieldTypes.SEARCH,
		},
	},
}
