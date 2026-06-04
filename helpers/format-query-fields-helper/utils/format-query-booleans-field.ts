/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { IFormattedBooleanField } from '@/actions/base-models/filters/filter-fields/base-boolean-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'

export const formatQueryBooleansFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IFormattedBooleanField | undefined => {
	const { value } = queryItem

	return value === 'true' ? true : value === 'false' ? false : undefined
}
