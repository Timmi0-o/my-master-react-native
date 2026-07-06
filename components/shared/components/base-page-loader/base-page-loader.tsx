import { cn } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'
import type { IBasePageLoaderProps } from './base-page-loader.types'
import { BasePageLoaderDefaultBody } from './components/base-page-loader-default-body'
import { BasePageLoaderFormBody } from './components/base-page-loader-form-body'
import { BasePageLoaderHeader } from './components/base-page-loader-header'
import { BasePageLoaderHubBody } from './components/base-page-loader-hub-body'
import { BasePageLoaderListBody } from './components/base-page-loader-list-body'
import { BasePageLoaderProfileBody } from './components/base-page-loader-profile-body'

const DEFAULT_ITEM_COUNT = 3
const DEFAULT_FIELD_COUNT = 4

export function BasePageLoader({
	variant = 'default',
	itemCount = DEFAULT_ITEM_COUNT,
	fieldCount = DEFAULT_FIELD_COUNT,
	showHeader = true,
	showHeaderRightAction = false,
	className,
	style,
}: IBasePageLoaderProps): ReactElement {
	const resolvedShowHeaderRightAction =
		showHeaderRightAction || variant === 'list' || variant === 'form'

	return (
		<View className={cn('w-full self-stretch', className)} style={style}>
			{showHeader ? (
				<BasePageLoaderHeader showRightAction={resolvedShowHeaderRightAction} />
			) : null}

			{variant === 'hub' ? <BasePageLoaderHubBody /> : null}
			{variant === 'list' ? (
				<BasePageLoaderListBody itemCount={itemCount} />
			) : null}
			{variant === 'form' ? (
				<BasePageLoaderFormBody fieldCount={fieldCount} />
			) : null}
			{variant === 'default' ? (
				<BasePageLoaderDefaultBody itemCount={itemCount} />
			) : null}
			{variant === 'profile' ? <BasePageLoaderProfileBody /> : null}
		</View>
	)
}

export type {
	BasePageLoaderVariant,
	IBasePageLoaderProps,
} from './base-page-loader.types'

export { BasePageLoaderDefaultBody } from './components/base-page-loader-default-body'
export { BasePageLoaderFormBody } from './components/base-page-loader-form-body'
export { BasePageLoaderHeader } from './components/base-page-loader-header'
export { BasePageLoaderHubBody } from './components/base-page-loader-hub-body'
export { BasePageLoaderListBody } from './components/base-page-loader-list-body'
export { BasePageLoaderProfileBody } from './components/base-page-loader-profile-body'
