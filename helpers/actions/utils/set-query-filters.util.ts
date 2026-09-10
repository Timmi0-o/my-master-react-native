import { defaultQueryFormatter } from '@/helpers/base-query-formatter'
import { sanitizeQueryFiltersBySchema } from '@/helpers/actions/sanitize-query-filters-by-schema'
import { IActionFilters } from '@/types/i-action.types'
import { ZodSchema } from 'zod'

const appendRequiredIds = (
	searchParams: URLSearchParams,
	requiredIds: unknown,
): void => {
	if (Array.isArray(requiredIds)) {
		requiredIds.forEach((id) => {
			if (typeof id === 'string' && id.length > 0) {
				searchParams.append('requiredIds', id)
			}
		})
		return
	}

	if (typeof requiredIds === 'string' && requiredIds.length > 0) {
		searchParams.append('requiredIds', requiredIds)
	}
}

export const setQueryFilters = <TFilters>(
	url: string,
	filters: IActionFilters<TFilters> | undefined,
	queryFilterSchema?: ZodSchema<TFilters>,
	customFormatter?: (
		filters: IActionFilters<TFilters>,
	) => Record<string, string> | undefined,
): string => {
	if (queryFilterSchema && filters) {
		const sanitizedFilters = sanitizeQueryFiltersBySchema(
			queryFilterSchema,
			filters,
		)

		if (Object.keys(sanitizedFilters).length) {
			const formattedParams = customFormatter
				? customFormatter(sanitizedFilters)
				: defaultQueryFormatter(sanitizedFilters)

			const searchParams = new URLSearchParams()

			if (formattedParams) {
				Object.entries(formattedParams).forEach(([key, value]) => {
					searchParams.set(key, value)
				})
			}

			appendRequiredIds(
				searchParams,
				(sanitizedFilters as Record<string, unknown>).requiredIds,
			)

			if ([...searchParams.keys()].length > 0) {
				url += `?${searchParams.toString()}`
			}
		}
	}

	return url
}
