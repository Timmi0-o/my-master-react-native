import { useMasterSettingsProfile } from '@/components/pages/master-settings/hooks/use-master-settings-profile'
import { MasterServiceEditSkeleton } from '@/components/pages/master-settings/services/edit/components/master-service-edit-skeleton'
import { MasterServiceEditPage } from '@/components/pages/master-settings/services/edit/master-service-edit-page'
import { RouteErrorState } from '@/components/shared/components/route-error-state/route-error-state'
import { routeErrorText } from '@/configs/i18n/use-route-feedback'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceGetOne } from '@/hooks/actions/master-service/use-master-service-get-one'
import { useLocalSearchParams } from 'expo-router'
import type { ReactElement } from 'react'

export default function MasterServiceEditScreen(): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterService')
	const { t: tMasterSettings } = useScopedTranslation('pages', 'masterSettings')

	const { id } = useLocalSearchParams<{ id?: string }>()

	const serviceId = Array.isArray(id) ? id[0] : id

	const {
		masterProfile,
		isLoading: isProfileLoading,
		error,
	} = useMasterSettingsProfile()

	const {
		data: service,
		isLoading: isServiceLoading,
		error: serviceError,
	} = useMasterServiceGetOne(serviceId ?? '')

	if (isProfileLoading || isServiceLoading) {
		return <MasterServiceEditSkeleton />
	}

	if (error?.message || !masterProfile) {
		return (
			<RouteErrorState
				message={
					error?.message
						? routeErrorText(error.message)
						: tMasterSettings('masterProfileNotFound')
				}
				withBackButton
			/>
		)
	}

	if (serviceError?.message) {
		return (
			<RouteErrorState
				message={routeErrorText(serviceError.message)}
				withBackButton
			/>
		)
	}

	if (!service) {
		return <RouteErrorState message={t('notFound')} withBackButton />
	}

	return <MasterServiceEditPage service={service} />
}
