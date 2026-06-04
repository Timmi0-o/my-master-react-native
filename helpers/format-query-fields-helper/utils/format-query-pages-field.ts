/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { IPageField } from '@/actions/base-models/filters/filter-fields/base-page-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import { isNumberTest } from '@/utils/is-number-test.util'

export const formatQueryPagesFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IPageField => {
	const { value } = queryItem

	const isValidValue = isNumberTest(value)

	if (!isValidValue) {
		return 1
	}

	return Number(value)
}
