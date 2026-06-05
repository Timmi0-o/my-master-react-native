import { QUERY_ARRAY_SEPARATOR } from '@/constants/query-array-separator'
import {
	type Href,
	useCurrentRouteInfo,
	usePathname,
	useRouter,
} from 'expo-router'
import { IRawSearchParams } from '@/types/i-query-object'
import { useMemo } from 'react'

enum ENavigationMode {
	BY_REFRESH_SERVER = 'BY_REFRESH_SERVER',
	BY_NO_REFRESH_SERVER = 'BY_NO_REFRESH_SERVER',
}

interface IHandlePushKeyInSearchParamsInterface {
	key: string
	value: string | null | number | object | undefined | boolean
}

interface IHandlePushKeyInSearchParamsOptions {
	navigationMode?: keyof typeof ENavigationMode
}

type IHandlePushKeyInSearchParamsProps =
	| IHandlePushKeyInSearchParamsInterface
	| IHandlePushKeyInSearchParamsInterface[]

interface IUseManageSearchParamsReturn {
	pathname: string
	/** Query текущего маршрута как плоский объект (для formatQueryGet*). */
	searchParams: IRawSearchParams
	/** Строка query для queryKey / сравнения URL (`search=foo&page=1`). */
	searchParamsQuery: string
	handlePushKeyInSearchParams: (
		props: IHandlePushKeyInSearchParamsProps,
		options?: IHandlePushKeyInSearchParamsOptions,
	) => void
	buildQueryValue: (props: IHandlePushKeyInSearchParamsProps) => string
}

const buildSetParamsPayload = (
	current: URLSearchParams,
	next: URLSearchParams,
): Record<string, string | undefined> => {
	const payload: Record<string, string | undefined> = {}

	next.forEach((value, key) => {
		if (current.get(key) !== value) {
			payload[key] = value
		}
	})

	current.forEach((_, key) => {
		if (!next.has(key)) {
			payload[key] = undefined
		}
	})

	return payload
}

export const useManageSearchParams = (): IUseManageSearchParamsReturn => {
	const router = useRouter()
	const pathname = usePathname()
	const routeInfo = useCurrentRouteInfo()
	const urlSearchParams = useMemo(
		() => new URLSearchParams(routeInfo?.searchParams.toString() ?? ''),
		[routeInfo?.searchParams],
	)

	const searchParams = useMemo<IRawSearchParams>(
		() => Object.fromEntries(urlSearchParams.entries()),
		[urlSearchParams],
	)

	const searchParamsQuery = urlSearchParams.toString()

	const buildQueryValue = (props: IHandlePushKeyInSearchParamsProps) => {
		const newSearchParams = new URLSearchParams(urlSearchParams.toString())

		const items = Array.isArray(props) ? props : [props]

		items.forEach((paramsItem) => {
			const { key, value } = paramsItem

			const formattedValue = Array.isArray(value)
				? value.join(QUERY_ARRAY_SEPARATOR)
				: value

			if (!formattedValue) {
				newSearchParams.delete(key)
			} else {
				newSearchParams.set(key, String(formattedValue))
			}
		})

		return newSearchParams.toString()
	}

	const handlePushKeyInSearchParams = (
		props: IHandlePushKeyInSearchParamsProps,
		options: IHandlePushKeyInSearchParamsOptions = {},
	) => {
		const queryString = buildQueryValue(props)

		const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
		const currentUrl = `${pathname}${searchParamsQuery ? `?${searchParamsQuery}` : ''}`

		if (nextUrl === currentUrl) return

		if (options.navigationMode === ENavigationMode.BY_NO_REFRESH_SERVER) {
			const nextSearchParams = new URLSearchParams(queryString)
			router.setParams(
				buildSetParamsPayload(urlSearchParams, nextSearchParams),
			)
			return
		}

		router.replace(nextUrl as Href)
	}

	return {
		pathname,
		searchParams,
		searchParamsQuery,
		handlePushKeyInSearchParams,
		buildQueryValue,
	}
}
