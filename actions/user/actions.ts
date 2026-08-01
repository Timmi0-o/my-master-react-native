import { API_ROUTES } from '@/constants/api-routes'
import { abstractMutateAction } from '@/helpers/action.helper'
import type { ApiLanguage } from '@/helpers/i18n/api-language'
import type { IActionResponse } from '@/types/i-action.types'

export type IUpdateOwnLanguageActionInput = {
	language: ApiLanguage
}

export type IUpdateOwnLanguageActionOutput = {
	id: string
	language: ApiLanguage
}

export const updateOwnLanguage = async (
	data: IUpdateOwnLanguageActionInput,
): Promise<IActionResponse<IUpdateOwnLanguageActionOutput | null>> =>
	abstractMutateAction<
		IUpdateOwnLanguageActionOutput | null,
		IUpdateOwnLanguageActionInput
	>({
		url: API_ROUTES.users.updateOwnLanguage,
		params: {
			method: 'PATCH',
			body: data,
		},
	})
