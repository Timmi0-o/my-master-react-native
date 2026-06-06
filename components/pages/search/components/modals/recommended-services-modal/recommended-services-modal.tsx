import { IRecommendedService } from '@/actions/service/models/service.schema'
import { ServiceCard } from '@/components/shared/components/service-card/service-card'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BottomSheet } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

interface IRecommendedServicesModalProps {
	isVisible: boolean
	services: IRecommendedService[]
	onClose: () => void
}

export function RecommendedServicesModal({
	isVisible,
	services,
	onClose,
}: IRecommendedServicesModalProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'search')

	const handleOpenChange = (value: boolean) => {
		if (!value) {
			onClose()
		}
	}

	return (
		<BottomSheet isOpen={isVisible} onOpenChange={handleOpenChange}>
			<BottomSheet.Portal>
				<BottomSheet.Overlay />
				<BottomSheet.Content
					contentContainerClassName='h-full px-4'
					enableDynamicSizing={false}
					enableOverDrag={false}
					snapPoints={['60%', '85%']}
				>
					<BottomSheet.Title>{t('recommendedForYou')}</BottomSheet.Title>
					<BottomSheet.Description>
						{t('servicesTotalCount', { count: services.length })}
					</BottomSheet.Description>

					<BottomSheetScrollView
						contentContainerClassName='gap-3 pb-4'
						showsVerticalScrollIndicator={false}
					>
						{services.length === 0 ? (
							<Text className='text-base text-muted'>
								{t('servicesNotFound')}
							</Text>
						) : (
							services.map((service) => (
								<ServiceCard
									key={service.id}
									onBeforeNavigate={onClose}
									service={service}
								/>
							))
						)}
					</BottomSheetScrollView>
				</BottomSheet.Content>
			</BottomSheet.Portal>
		</BottomSheet>
	)
}
