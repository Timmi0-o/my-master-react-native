import type { IMasterServiceReview } from '@/actions/master-service-review/models/master-service-review.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Card, Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'

interface IMasterServiceReviewsSectionProps {
	reviews: IMasterServiceReview[]
	isLoading: boolean
}

function ReviewCard({ review }: { review: IMasterServiceReview }): ReactElement {
	const clientName = review.clientUser?.name ?? review.clientUser?.username ?? '—'

	return (
		<Card>
			<Card.Body className='gap-2'>
				<View className='flex-row items-center justify-between'>
					<Text className='font-semibold text-foreground'>{clientName}</Text>
					<View className='flex-row items-center gap-1'>
						<Ionicons name='star' size={14} color='#f59e0b' />
						<Text className='text-sm text-foreground'>{review.rating}</Text>
					</View>
				</View>
				<Text className='text-sm text-muted'>{review.text}</Text>
			</Card.Body>
		</Card>
	)
}

export function MasterServiceReviewsSection({
	reviews,
	isLoading,
}: IMasterServiceReviewsSectionProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterService')

	if (isLoading) {
		return (
			<View className='gap-3'>
				<Skeleton className='h-24 w-full rounded-2xl' />
				<Skeleton className='h-24 w-full rounded-2xl' />
			</View>
		)
	}

	if (!reviews.length) {
		return <Text className='text-muted'>{t('reviewsEmpty')}</Text>
	}

	return (
		<View className='gap-3'>
			{reviews.map((review) => (
				<ReviewCard key={review.id} review={review} />
			))}
		</View>
	)
}
