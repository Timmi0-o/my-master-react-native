import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useMasterServiceReviewGetMany } from '@/hooks/actions/master-service-review/use-master-service-review-get-many'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Tabs } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { MasterServiceGallery } from '../master-service-gallery/master-service-gallery'
import { MasterServiceReviewsSection } from '../master-service-reviews-section/master-service-reviews-section'

interface IMasterServiceContentProps {
	service: IMasterService
}

export function MasterServiceContent({
	service,
}: IMasterServiceContentProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterService')
	const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
	const isReviewsTabActive = activeTab === 'reviews'

	const { data: reviews = [], isLoading: isReviewsLoading } =
		useMasterServiceReviewGetMany(
			{
				filter: {
					masterServiceId: { value: [service.id], mode: 'OR' },
				},
			},
			{ enabled: isReviewsTabActive },
		)

	return (
		<View className='gap-4'>
			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as 'details' | 'reviews')}
			>
				<Tabs.List>
					<Tabs.Trigger value='details'>
						<Tabs.Label>{t('detailsTab')}</Tabs.Label>
					</Tabs.Trigger>
					<Tabs.Trigger value='reviews'>
						<Tabs.Label>
							{t('reviewsTab')}
							{reviews.length > 0 ? ` (${reviews.length})` : ''}
						</Tabs.Label>
					</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value='details'>
					<View className='gap-4 pt-4'>
						<MasterServiceGallery service={service} />
						{service.description ? (
							<View className='gap-2'>
								<Text className='text-lg font-semibold text-foreground'>
									{t('descriptionTitle')}
								</Text>
								<Text className='text-base text-muted'>{service.description}</Text>
							</View>
						) : null}
					</View>
				</Tabs.Content>

				<Tabs.Content value='reviews'>
					<View className='pt-4'>
						<MasterServiceReviewsSection
							reviews={reviews}
							isLoading={isReviewsLoading}
						/>
					</View>
				</Tabs.Content>
			</Tabs>
		</View>
	)
}
