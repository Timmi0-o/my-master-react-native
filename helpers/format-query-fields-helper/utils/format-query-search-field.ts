/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { ISearchField } from '@/actions/base-models/filters/filter-fields/base-search-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'

export const formatQuerySearchFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): ISearchField => {
	const { value, mode } = queryItem

	const isValidValue = typeof value === 'string'

	if (!isValidValue) {
		return undefined
	}

	return {
		value,
		mode: (mode as 'PARTIAL' | 'STRICT' | undefined) ?? 'PARTIAL',
	}
}
