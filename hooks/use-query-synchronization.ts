'use client'

import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import {
	IParsedQueryFieldValue,
	parseQueryFieldValueFromSearchParams,
} from '@/helpers/format-query-fields-helper/utils/parse-query-field-from-search-params'
import { useEffect, useMemo, useRef } from 'react'
import { useManageSearchParams } from './use-manage-search-params'

interface IUseQuerySynchronizationProps {
	key: string
	keyType: FieldTypes
	setValue: (value: IParsedQueryFieldValue) => void
}

/**
 * Синхронизация значений из URL-параметров в локальные состояния
 * @param items Массив элементов для синхронизации
 *
 * {
 * 	key: 'search',
 * 	keyType: 'SEARCH',
 * 	setValue: (value) => setLocalSearch(value as string),
 * }
 */
export const useQuerySynchronization = (
	items: IUseQuerySynchronizationProps[] | IUseQuerySynchronizationProps,
): void => {
	const { searchParamsQuery } = useManageSearchParams()

	const normalizedItems = useMemo(
		() => (Array.isArray(items) ? items : [items]),
		[items],
	)

	const itemsRef = useRef(normalizedItems)
	const prevQueryRef = useRef<string | null>(null)

	const querySignature = searchParamsQuery

	useEffect(() => {
		itemsRef.current = normalizedItems
	}, [normalizedItems])

	useEffect(() => {
		const paramsFromUrl = new URLSearchParams(querySignature)
		const prevParams =
			prevQueryRef.current !== null
				? new URLSearchParams(prevQueryRef.current)
				: null

		const isInitialSync = prevParams === null
		prevQueryRef.current = querySignature

		itemsRef.current.forEach((item) => {
			const hasParamChanged =
				isInitialSync ||
				paramsFromUrl.getAll(item.key).join(',') !==
					prevParams!.getAll(item.key).join(',')

			if (!hasParamChanged) return

			const value = parseQueryFieldValueFromSearchParams(
				item.keyType,
				paramsFromUrl,
				item.key,
			)

			item.setValue(value)
		})
	}, [querySignature])
}
