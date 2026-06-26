import { IMyMasterEndpointResponse } from '@/contracts/api-response/my-master-api-core/types/i-my-master-endpoint-response.type'
import { myMasterEndpointResponseMapper } from '@/contracts/api-response/my-master-api-core'
import { IAppActionResponseError } from '@/contracts/api-response/types'
import { resolveActionErrorMessage } from '@/helpers/resolve-action-error-message'
import { scopedT } from '@/configs/i18n/scoped-t'

export const ErrorObjectSetup = async (
	res: Response,
): Promise<{ result: null; error: IAppActionResponseError } | undefined> => {
	if (res.ok) return

	let errorData: IAppActionResponseError

	try {
		const errorResponse = (await res.json()) as IMyMasterEndpointResponse
		const formattedErrorResponse =
			myMasterEndpointResponseMapper(errorResponse)?.error

		errorData = {
			statusCode: formattedErrorResponse?.statusCode || res.status,
			timestamp:
				formattedErrorResponse?.timestamp || new Date().toISOString(),
			message: formattedErrorResponse?.message
				? resolveActionErrorMessage(formattedErrorResponse.message)
				: scopedT('requestFailed', 'common', 'errors', { status: res.status }),
		}
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: scopedT('localAppError', 'common', 'errors', {
				status: res.status,
			}),
		}
	}

	return { result: null, error: errorData }
}
