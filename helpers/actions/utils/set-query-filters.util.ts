import { defaultQueryFormatter } from '@/helpers/base-query-formatter'
import { sanitizeQueryFiltersBySchema } from '@/helpers/actions/sanitize-query-filters-by-schema'
import { IActionFilters } from '@/types/i-action.types'
import { ZodSchema } from 'zod'

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

			if (formattedParams && Object.keys(formattedParams).length > 0) {
				url += `?${new URLSearchParams(formattedParams as Record<string, string>)}`
			}
		}
	}

	return url
}
