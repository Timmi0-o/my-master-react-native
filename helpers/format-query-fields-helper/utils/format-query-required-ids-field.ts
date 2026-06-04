/**
 * Внутренний хелпер для использования внутри formatQueryFields.
 * Не предназначен для внешнего применения.
 *
 * Строка вида `id1_id2_id3` → массив `['id1', 'id2', 'id3']` (разделитель — `_`).
 */
import { IFormattedRequiredIdsField } from '@/actions/base-models/filters/filter-fields/base-required-ids-filter.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'

const splitUnderscoreIds = (raw: string): string[] => {
	return raw
		.split('_')
		.map((id) => id.trim())
		.filter(Boolean)
}

export const formatQueryRequiredIdsFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>,
): IFormattedRequiredIdsField => {
	const { value } = queryItem

	if (Array.isArray(value)) {
		const ids = value
			.filter((item): item is string => typeof item === 'string')
			.flatMap((item) => splitUnderscoreIds(item))

		return ids
	}

	if (typeof value !== 'string') {
		return []
	}

	return splitUnderscoreIds(value)
}
