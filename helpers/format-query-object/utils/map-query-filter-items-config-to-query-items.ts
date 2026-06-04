import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import {
	IQueryFilterItemsConfig,
	IQueryFilterItemsConfigEntry,
} from '../types/i-query-filter-items-config'

const mapConfigEntriesToQueryItems = (
	entries:
		| Partial<Record<string, IQueryFilterItemsConfigEntry | undefined>>
		| undefined,
	searchParams: Record<string, string>,
): IRawQueryField[] => {
	if (!entries) {
		return []
	}

	return Object.entries(entries).flatMap(([key, entry]) => {
		if (!entry) {
			return []
		}

		const { renameKey, ...rest } = entry

		if (!searchParams[key]) return []

		return [
			{
				...rest,
				value: searchParams[key] ?? '',
				key: renameKey ?? key,
			},
		]
	})
}

export function mapQueryFilterItemsConfigToQueryItems<
	TFilters extends Record<string, unknown>,
>(
	config: IQueryFilterItemsConfig<TFilters>,
	searchParams: Record<string, string>,
): {
	rootItems: IRawQueryField[]
	filterItems: IRawQueryField[]
} {
	const { filter, ...rootConfig } = config

	return {
		rootItems: mapConfigEntriesToQueryItems(rootConfig, searchParams),
		filterItems: mapConfigEntriesToQueryItems(filter, searchParams),
	}
}
