import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { IRawQueryField } from '@/actions/base-models/filters/raw-query-field.schema'
import { IQueryFilterObject } from '@/types/i-query-object'
import { createLogger } from '@/utils/logger.util'
import { formatQueryBooleansFieldInternal } from './utils/format-query-booleans-field'
import { formatQueryDatesFieldInternal } from './utils/format-query-dates-field'
import { formatQueryLimitsFieldInternal } from './utils/format-query-limits-field'
import { formatQueryNumbersFieldInternal } from './utils/format-query-numbers-field'
import { formatQueryPagesFieldInternal } from './utils/format-query-pages-field'
import { formatQueryRequiredIdsFieldInternal } from './utils/format-query-required-ids-field'
import { formatQuerySearchFieldInternal } from './utils/format-query-search-field'
import { formatQueryStringsFieldInternal } from './utils/format-query-strings-field'

/**
 * Преобразует массив queryItems, определяя их тип (fieldType) и форматируя значения
 * согласно внутренним хелперам форматов. Возвращает flat-объект полей одного уровня.
 * Для API-группы `filter` используйте `formatQueryFromFilterItemsConfig`.
 *
 * ## Поддерживаемые типы fieldType:
 * - 'DATE'     — даты или диапазоны дат (исп. formatQueryDatesFieldInternal)
 * - 'NUMBER'   — числа или диапазоны чисел (исп. formatQueryNumbersFieldInternal)
 * - 'STRING'   — строковые значения или массивы (исп. formatQueryStringsFieldInternal)
 * - 'BOOLEAN'  — булево значение (исп. formatQueryBooleansFieldInternal)
 * - 'LIMIT'    — лимит постраничного вывода (исп. formatQueryLimitsFieldInternal)
 * - 'PAGE'     — номер страницы (исп. formatQueryPagesFieldInternal)
 * - 'SEARCH'   — поисковое значение (исп. formatQuerySearchFieldInternal)
 * - 'REQUIRED_IDS' — id через `_`, например `a_b_c` → массив строк (исп. formatQueryRequiredIdsFieldInternal)
 *
 * ## Особенности
 * - Неизвестные типы полей логгируются в консоль (logger.warn), но игнорируются.
 * - Если значение для поля неподходящее (например, пустой массив), оно пропускается.
 * - Используйте для единого преобразования поисковых/фильтрационных query-параметров в серверный payload.
 *
 * @param queryItems Один или массив описаний полей фильтра без значений key/fieldType
 * @returns flat-объект полей (page, limit, search и т.д.)
 */
export const formatQueryFields = <
	TQueryItems extends IRawQueryField | IRawQueryField[],
>({
	queryItems,
}: {
	queryItems: TQueryItems
}): IQueryFilterObject => {
	const logger = createLogger('FORMAT QUERY FIELDS')

	const normalizedQueryItems = Array.isArray(queryItems)
		? queryItems
		: [queryItems]

	const resultItems: IQueryFilterObject = {}

	normalizedQueryItems.forEach((queryItem) => {
		const { fieldType, key, ...queryItemWithoutFieldType } = queryItem

		switch (fieldType) {
			case FieldTypes.DATE: {
				const datesResult = formatQueryDatesFieldInternal(
					queryItemWithoutFieldType,
				)
				if (datesResult.value.length) {
					resultItems[key] = datesResult
				}
				break
			}
			case FieldTypes.NUMBER: {
				const numbersResult = formatQueryNumbersFieldInternal(
					queryItemWithoutFieldType,
				)
				if (numbersResult.value.length) {
					resultItems[key] = numbersResult
				}
				break
			}
			case FieldTypes.STRING: {
				const stringsResult = formatQueryStringsFieldInternal(
					queryItemWithoutFieldType,
				)
				if (stringsResult.value.length) {
					resultItems[key] = stringsResult
				}
				break
			}
			case FieldTypes.BOOLEAN: {
				const booleanResult = formatQueryBooleansFieldInternal(
					queryItemWithoutFieldType,
				)
				if (typeof booleanResult === 'boolean') {
					resultItems[key] = booleanResult
				}
				break
			}
			case FieldTypes.LIMIT:
				resultItems[key] = formatQueryLimitsFieldInternal(
					queryItemWithoutFieldType,
				)
				break
			case FieldTypes.PAGE:
				resultItems[key] = formatQueryPagesFieldInternal(
					queryItemWithoutFieldType,
				)
				break
			case FieldTypes.SEARCH: {
				const searchResult = formatQuerySearchFieldInternal(
					queryItemWithoutFieldType,
				)
				if (searchResult) {
					resultItems[key] = searchResult
				}
				break
			}
			case FieldTypes.REQUIRED_IDS: {
				const requiredIdsResult = formatQueryRequiredIdsFieldInternal(
					queryItemWithoutFieldType,
				)
				if (requiredIdsResult?.length) {
					resultItems[key] = requiredIdsResult
				}
				break
			}
			default:
				logger.warn(`Unknown field type for QUERY ITEM: ${key} - ${fieldType}`)
		}
	})

	return resultItems
}
