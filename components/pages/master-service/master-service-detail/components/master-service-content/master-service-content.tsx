import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceReviewGetMany } from '@/hooks/actions/master-service-review/use-master-service-review-get-many'
import { Tabs } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { MasterServiceGallery } from '../master-service-gallery/master-service-gallery'
import { MasterServiceReviewsSection } from '../master-service-reviews-section/master-service-reviews-section'

interface IMasterServiceContentProps {
	service: IMasterService
}

type MasterServiceTab = 'details' | 'reviews'

const isMasterServiceTab = (value: string): value is MasterServiceTab =>
	value === 'details' || value === 'reviews'

export function MasterServiceContent({
	service,
}: IMasterServiceContentProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterService')
	const [activeTab, setActiveTab] = useState<MasterServiceTab>('details')
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

	const reviewsTabLabel =
		reviews.length > 0
			? t('reviewsTabWithCount', { count: reviews.length })
			: t('reviewsTab')

	const tabs: { value: MasterServiceTab; label: string }[] = [
		{ value: 'details', label: t('detailsTab') },
		{ value: 'reviews', label: reviewsTabLabel },
	]

	const handleTabChange = (value: string): void => {
		if (isMasterServiceTab(value)) {
			setActiveTab(value)
		}
	}

	return (
		<Tabs
			className='gap-4'
			onValueChange={handleTabChange}
			value={activeTab}
			variant='primary'
		>
			<Tabs.List className='w-full self-stretch'>
				<Tabs.Indicator />
				{tabs.map((tab) => (
					<Tabs.Trigger key={tab.value} className='flex-1' value={tab.value}>
						<Tabs.Label className='text-sm' numberOfLines={1}>
							{tab.label}
						</Tabs.Label>
					</Tabs.Trigger>
				))}
			</Tabs.List>

			<Tabs.Content value='details'>
				<View className='gap-4'>
					<MasterServiceGallery service={service} />
					{service.description ? (
						<View className='gap-2'>
							<Text className='text-lg font-semibold text-foreground'>
								{t('descriptionTitle')}
							</Text>
							<Text className='text-base text-muted'>
								{service.description}
							</Text>
						</View>
					) : null}
				</View>
			</Tabs.Content>

			<Tabs.Content value='reviews'>
				<MasterServiceReviewsSection
					reviews={reviews}
					isLoading={isReviewsLoading}
				/>
			</Tabs.Content>
		</Tabs>
	)
}
