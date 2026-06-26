import { ACTION_ERROR_TRANSLATION_REGISTRY } from '@/helpers/action-error-translations.registry'
import { scopedT } from '@/configs/i18n/scoped-t'

export const resolveActionErrorMessage = (error: string): string => {
	const entry = ACTION_ERROR_TRANSLATION_REGISTRY.find(({ match }) =>
		error.includes(match),
	)

	if (!entry) {
		return error
	}

	const translated = scopedT(entry.ref.key, 'common', entry.ref.keyPrefix)

	return translated === entry.ref.key ? error : translated
}
