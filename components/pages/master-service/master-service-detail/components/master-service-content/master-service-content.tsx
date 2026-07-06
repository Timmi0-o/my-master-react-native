import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceReviewGetMany } from '@/hooks/actions/master-service-review/use-master-service-review-get-many'
import { cn } from 'heroui-native'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { MasterServiceGallery } from '../master-service-gallery/master-service-gallery'
import { MasterServiceReviewsSection } from '../master-service-reviews-section/master-service-reviews-section'

interface IMasterServiceContentProps {
	service: IMasterService
}

type MasterServiceTab = 'details' | 'reviews'

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

	return (
		<View className='gap-4'>
			<View
				accessibilityRole='tablist'
				className='w-full flex-row gap-1 rounded-2xl bg-surface p-1'
			>
				{tabs.map((tab) => {
					const isActive = activeTab === tab.value

					return (
						<Pressable
							key={tab.value}
							accessibilityRole='tab'
							accessibilityState={{ selected: isActive }}
							className={cn(
								'flex-1 items-center rounded-xl py-2.5 active:opacity-80',
								isActive && 'bg-accent',
							)}
							onPress={() => setActiveTab(tab.value)}
						>
							<Text
								className={cn(
									'text-center text-sm font-semibold',
									isActive ? 'text-accent-foreground' : 'text-muted',
								)}
								numberOfLines={1}
							>
								{tab.label}
							</Text>
						</Pressable>
					)
				})}
			</View>

			{activeTab === 'details' ? (
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
			) : (
				<MasterServiceReviewsSection
					reviews={reviews}
					isLoading={isReviewsLoading}
				/>
			)}
		</View>
	)
}
