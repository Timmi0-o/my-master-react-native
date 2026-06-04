/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { IFormattedStringField } from '@/actions/base-models/filters/filter-fields/base-string-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import { QUERY_ARRAY_SEPARATOR } from '@/constants/query-array-separator'

export const formatQueryStringsFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IFormattedStringField => {
	const { value } = queryItem

	const formattedValue: string[] = value
		?.toString()
		.split(QUERY_ARRAY_SEPARATOR)
		.filter(Boolean)

	const normalizedValue = Array.isArray(formattedValue)
		? formattedValue
		: [formattedValue]

	const resultItems: string[] = []

	normalizedValue.forEach((item) => {
		if (typeof item !== 'string') {
			return
		}

		resultItems.push(item)
	})

	return { value: resultItems.filter(Boolean), mode: 'OR' }
}
