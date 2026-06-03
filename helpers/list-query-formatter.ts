const SCALAR_QUERY_KEYS = new Set([
	'limit',
	'page',
	'status',
	'search',
	'preset',
	'orderField',
	'orderDir',
])

export const listQueryFormatter = (
	filters: Record<string, unknown>,
): Record<string, string> | undefined => {
	const params: Record<string, string> = {}

	Object.entries(filters).forEach(([key, value]) => {
		if (value === undefined || value === null) return

		if (SCALAR_QUERY_KEYS.has(key)) {
			params[key] = typeof value === 'string' ? value : String(value)
			return
		}

		if (key === 'filter') {
			params[key] =
				typeof value === 'string' ? value : JSON.stringify(value)
			return
		}

		params[key] = typeof value === 'string' ? value : JSON.stringify(value)
	})

	return Object.keys(params).length > 0 ? params : undefined
}
