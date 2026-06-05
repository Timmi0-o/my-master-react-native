import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'

export type IQueryFilterItemsConfigEntry = Omit<
	IRawQueryField,
	'value' | 'key'
> & {
	renameKey?: string
}

type QueryRootConfigKeys<TFilters> = Exclude<keyof TFilters, 'filter'>

type QueryFilterGroupKeys<TFilters extends Record<string, unknown>> =
	'filter' extends keyof TFilters
		? NonNullable<TFilters['filter']> extends Record<string, unknown>
			? keyof NonNullable<TFilters['filter']>
			: never
		: never

type QueryFilterConfig<TFilters extends Record<string, unknown>> =
	'filter' extends keyof TFilters
		? {
				filter?: Partial<
					Record<
						Extract<QueryFilterGroupKeys<TFilters>, string>,
						IQueryFilterItemsConfigEntry
					>
				>
			}
		: {}

export type IQueryFilterItemsConfig<
	TFilters extends Record<string, unknown> = Record<string, unknown>,
> = Partial<
	Record<
		Extract<QueryRootConfigKeys<TFilters>, string>,
		IQueryFilterItemsConfigEntry
	>
> &
	QueryFilterConfig<TFilters>

export interface IQueryFilterItemsConfigItem<
	TFilterKey extends string,
> extends IQueryFilterItemsConfigEntry {
	key: TFilterKey
}
