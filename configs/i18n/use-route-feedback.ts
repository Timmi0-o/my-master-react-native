import { scopedT } from '@/configs/i18n/scoped-t'

export const routeLoadingText = (): string => scopedT('loading', 'common')

export const routeErrorText = (message: string): string =>
	scopedT('errorPrefix', 'common', undefined, { message })
