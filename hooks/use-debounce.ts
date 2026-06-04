import { useEffect, useState } from 'react'

/**
 * Возвращает значение с задержкой после последнего изменения `value`.
 */
export const useDebounce = <T>(value: T, delayMs: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)

		return () => clearTimeout(timeoutId)
	}, [value, delayMs])

	return debouncedValue
}
