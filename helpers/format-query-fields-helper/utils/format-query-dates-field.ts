/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 */
import { IInclusiveRange } from '@/actions/base-models/filters/filter-fields/base-inclusive-range.schema'
import { IFormattedRangeField } from '@/actions/base-models/filters/filter-fields/base-range-filter.schema'
import { IStrictRange } from '@/actions/base-models/filters/filter-fields/base-strict-range.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'

export const formatQueryDatesFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IFormattedRangeField => {
	const { value, periodMode } = queryItem

	const normalizedValue = Array.isArray(value) ? value : [value]

	const resultItems: (IStrictRange | IInclusiveRange)[] = []

	normalizedValue.forEach((item) => {
		const dateRangeItem = item?.split('_')

		const isValidItem = dateRangeItem?.length > 0
		const isRange = dateRangeItem?.length === 2

		if (!isValidItem) {
			return
		}

		const [startDate, endDate] = dateRangeItem
		const endOrStart = isRange ? endDate : startDate

		if (periodMode === 'STRICT') {
			resultItems.push({ lt: startDate, gt: endOrStart })
		} else {
			resultItems.push({ lte: startDate, gte: endOrStart })
		}
	})

	return { value: resultItems.filter(Boolean), mode: 'OR' }
}
