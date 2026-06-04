import { i18n } from '@/configs/i18n/i18n'
import type { I18nNamespace } from '@/configs/i18n/i18n-namespaces'

/** `t` вне React (хуки, zod, утилиты). */
export const scopedT = (
	key: string,
	namespace: I18nNamespace = 'common',
	keyPrefix?: string,
	options?: Record<string, unknown>,
): string => i18n.t(key, { ns: namespace, keyPrefix, ...options })
