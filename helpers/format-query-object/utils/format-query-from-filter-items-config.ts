import { IQueryObject, IRawSearchParams } from '@/types/i-query-object'
import { formatQueryFields } from '../../format-query-fields-helper/format-query-fields'
import { IQueryFilterItemsConfig } from '../types/i-query-filter-items-config'
import { mapQueryFilterItemsConfigToQueryItems } from './map-query-filter-items-config-to-query-items'

export function formatQueryFromFilterItemsConfig<
	TFilters extends Record<string, unknown>,
>(
	config: IQueryFilterItemsConfig<TFilters>,
	searchParams: IRawSearchParams,
): IQueryObject {
	const { rootItems, filterItems } = mapQueryFilterItemsConfigToQueryItems(
		config,
		searchParams,
	)

	const result: NonNullable<IQueryObject> = {
		...(formatQueryFields({ queryItems: rootItems }) ?? {}),
	}

	const filter = formatQueryFields({ queryItems: filterItems })

	if (filter && Object.keys(filter).length > 0) {
		result.filter = filter
	}

	return result
}
