const normalizePrice = (price: string | undefined | number): number | null => {
	if (price === undefined || price === null) {
		return null
	}
	if (typeof price === 'number') {
		return Number.isFinite(price) ? price : null
	}
	const trimmed = String(price).trim()
	if (trimmed === '') {
		return null
	}
	const normalized = trimmed.replace(/\s/g, '').replace(',', '.')
	const parsed = Number.parseFloat(normalized)
	return Number.isFinite(parsed) ? parsed : null
}

export enum ECurrency {
	RUB = 'RUB',
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	JPY = 'JPY',
	CNY = 'CNY',
	KRW = 'KRW',
}

export const formatPriceByCurrency = (
	price: string | undefined | number,
	currency: ECurrency,
): string => {
	const numeric = normalizePrice(price)
	if (numeric === null) {
		return '—'
	}

	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency,
	}).format(numeric)
}
