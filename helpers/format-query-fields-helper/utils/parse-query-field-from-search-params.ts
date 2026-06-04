import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { isNumberTest } from '@/utils/is-number-test.util'

/**
 * Значение поля из URL после разбора — в форме, совместимой с сырым state / IRawQueryField.value
 * (обратная сторона formatQuery*FieldInternal).
 */
export type IParsedQueryFieldValue = string | string[] | number | boolean | null

const parseMultiStringParam = (
	rawValues: string[],
): string | string[] | null => {
	const filtered = rawValues.filter(Boolean)

	if (filtered.length === 0) {
		return null
	}

	if (filtered.length === 1) {
		return filtered[0]
	}

	return filtered
}

/**
 * Читает query-параметр из URLSearchParams так же, как formatQueryFields интерпретирует value
 * при сборке запроса на backend (см. format-query-*-field.ts).
 */
export const parseQueryFieldValueFromSearchParams = (
	keyType: FieldTypes,
	searchParams: URLSearchParams,
	key: string,
): IParsedQueryFieldValue => {
	switch (keyType) {
		case FieldTypes.BOOLEAN: {
			const value = searchParams.get(key)

			if (value === null) {
				return null
			}

			if (value === 'true') {
				return true
			}

			if (value === 'false') {
				return false
			}

			return null
		}
		case FieldTypes.LIMIT: {
			const value = searchParams.get(key)

			if (value === null || !isNumberTest(value)) {
				return 25
			}

			return Number(value)
		}
		case FieldTypes.PAGE: {
			const value = searchParams.get(key)

			if (value === null || !isNumberTest(value)) {
				return 1
			}

			return Number(value)
		}
		case FieldTypes.SEARCH: {
			const value = searchParams.get(key)

			if (value === null) {
				return ''
			}

			return value
		}
		case FieldTypes.REQUIRED_IDS: {
			const value = searchParams.get(key)

			if (value === null) {
				return ''
			}

			return value
		}
		case FieldTypes.STRING:
		case FieldTypes.DATE:
		case FieldTypes.NUMBER: {
			return parseMultiStringParam(searchParams.getAll(key))
		}
	}
}
