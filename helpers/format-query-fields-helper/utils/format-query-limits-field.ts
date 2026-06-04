/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { ILimitField } from '@/actions/base-models/filters/filter-fields/base-limit-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import { isNumberTest } from '@/utils/is-number-test.util'

export const formatQueryLimitsFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): ILimitField => {
	const { value } = queryItem

	const isValidValue = isNumberTest(value)

	if (!isValidValue) {
		return 25
	}

	return Number(value)
}
