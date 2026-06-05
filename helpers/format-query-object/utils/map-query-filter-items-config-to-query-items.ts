import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import {
	IQueryFilterItemsConfig,
	IQueryFilterItemsConfigEntry,
} from '../types/i-query-filter-items-config'

const mapConfigEntriesToQueryItems = (
	entries:
		| Partial<Record<string, IQueryFilterItemsConfigEntry | undefined>>
		| undefined,
	searchParams: Record<string, string | string[] | undefined>,
): IRawQueryField[] => {
	if (!entries) {
		return []
	}

	return Object.entries(entries).flatMap(([key, entry]) => {
		if (!entry) {
			return []
		}

		const rawValue = searchParams[key]

		if (rawValue === undefined || rawValue === null || rawValue === '') {
			return []
		}

		const { renameKey, ...rest } = entry

		return [
			{
				...rest,
				value: Array.isArray(rawValue) ? rawValue : String(rawValue),
				key: renameKey ?? key,
			},
		]
	})
}

export function mapQueryFilterItemsConfigToQueryItems<
	TFilters extends Record<string, unknown>,
>(
	config: IQueryFilterItemsConfig<TFilters>,
	searchParams: Record<string, string | string[] | undefined>,
): {
	rootItems: IRawQueryField[]
	filterItems: IRawQueryField[]
} {
	const { filter, ...rootConfig } = config

	return {
		rootItems: mapConfigEntriesToQueryItems(
			rootConfig as Partial<
				Record<string, IQueryFilterItemsConfigEntry | undefined>
			>,
			searchParams,
		),
		filterItems: mapConfigEntriesToQueryItems(
			filter as Partial<
				Record<string, IQueryFilterItemsConfigEntry | undefined>
			>,
			searchParams,
		),
	}
}
