import type { I18nNamespace } from '@/configs/i18n/i18n-namespaces'
import { useTranslation } from 'react-i18next'

/**
 * Namespace + optional key prefix (zone), e.g. `pages` + `settings` → `t('title')`.
 */
export const useScopedTranslation = (
	namespace: I18nNamespace,
	keyPrefix?: string,
) => useTranslation(namespace, { keyPrefix })
