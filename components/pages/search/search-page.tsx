import { IRecommendedService } from '@/actions/service/models/service.schema'
import { RecommendedServicesModal } from '@/components/pages/search/components/modals/recommended-services-modal/recommended-services-modal'
import { SEARCH_RECOMMENDED_SERVICES_PREVIEW_LIMIT } from '@/components/pages/search/data/search-recommended-services.constants'
import { MasterCard } from '@/components/shared/master-card/master-card'
import { ServiceCard } from '@/components/shared/service-card/service-card'
import { BasePage } from '@/components/shared/ui/base-page'
import { formatServiceMasterName } from '@/helpers/service/format-service-master-name'
import { useMasterGetMany } from '@/hooks/actions/master/use-master-get-many'
import { useServiceGetRecommendedForYou } from '@/hooks/actions/service/use-service-get-recommended-for-you'
import { Ionicons } from '@expo/vector-icons'
import { Button, Card, SearchField, useThemeColor } from 'heroui-native'
import { useMemo, useState } from 'react'
import { Image, ScrollView, Text, type ViewStyle } from 'react-native'

const RECOMMENDED_SERVICE_CARD_STYLE: ViewStyle = { width: 220 }
const VIEW_MORE_BUTTON_STYLE: ViewStyle = { minHeight: 88, width: 120 }

const matchesSearchQuery = (
	query: string,
	service: IRecommendedService,
): boolean => {
	const masterName = formatServiceMasterName(service.master).toLowerCase()

	return (
		service.name.toLowerCase().includes(query) ||
		masterName.includes(query) ||
		service.master.surname.toLowerCase().includes(query) ||
		service.master.name.toLowerCase().includes(query) ||
		service.master.patronymic.toLowerCase().includes(query)
	)
}

export const SearchPage = () => {
	const [value, setValue] = useState('')
	const [
		isRecommendedServicesModalVisible,
		setIsRecommendedServicesModalVisible,
	] = useState(false)

	const foregroundColor = useThemeColor('foreground')
	const { data: masters } = useMasterGetMany()
	const { data: recommendedServices } = useServiceGetRecommendedForYou()

	const query = value.trim().toLowerCase()

	const filteredRecommendedServices = useMemo(() => {
		if (!query || !recommendedServices) return recommendedServices

		return recommendedServices.filter((service) =>
			matchesSearchQuery(query, service),
		)
	}, [recommendedServices, query])

	const filteredMasters = useMemo(() => {
		if (!query || !masters) return masters

		return masters.filter(
			(master) =>
				master.name.toLowerCase().includes(query) ||
				master.services.some((service) =>
					service.name.toLowerCase().includes(query),
				),
		)
	}, [masters, query])

	const hasRecommendedServices = (filteredRecommendedServices?.length ?? 0) > 0
	const previewRecommendedServices = filteredRecommendedServices?.slice(
		0,
		SEARCH_RECOMMENDED_SERVICES_PREVIEW_LIMIT,
	)
	const shouldShowMoreRecommendedServicesButton =
		(filteredRecommendedServices?.length ?? 0) >
		SEARCH_RECOMMENDED_SERVICES_PREVIEW_LIMIT

	return (
		<BasePage disableTopSafeArea>
			<ScrollView contentContainerClassName='gap-3'>
				<Image
					source={require('@/assets/images/ad-mock.jpeg')}
					style={{ width: '100%', height: 250 }}
				/>

				<SearchField value={value} onChange={(value) => setValue(value)}>
					<SearchField.Group>
						<SearchField.SearchIcon />
						<SearchField.Input
							style={{ minHeight: 60 }}
							placeholder='Найдите услуги...'
						/>
						<SearchField.ClearButton />
					</SearchField.Group>
				</SearchField>

				<Card className='gap-2'>
					<Card.Header>
						<Text className='text-2xl font-bold text-foreground ml-2'>
							Специально для вас
						</Text>
					</Card.Header>
					<Card.Body className='mt-1 p-0'>
						{hasRecommendedServices ? (
							<ScrollView
								horizontal
								contentContainerClassName='gap-3 pr-2'
								showsHorizontalScrollIndicator={false}
							>
								{previewRecommendedServices?.map((service) => (
									<ServiceCard
										key={service.id}
										service={service}
										style={RECOMMENDED_SERVICE_CARD_STYLE}
									/>
								))}

								{shouldShowMoreRecommendedServicesButton && (
									<Button
										className='rounded-2xl h-full'
										onPress={() => setIsRecommendedServicesModalVisible(true)}
										style={VIEW_MORE_BUTTON_STYLE}
										variant='outline'
									>
										<Ionicons
											name='albums-outline'
											size={20}
											color={foregroundColor}
										/>
										<Button.Label>Еще</Button.Label>
									</Button>
								)}
							</ScrollView>
						) : (
							<Text className='text-base text-muted ml-2'>
								Услуги не найдены
							</Text>
						)}
					</Card.Body>
				</Card>

				<Card className='gap-2'>
					<Card.Header>
						<Text className='text-2xl font-bold text-foreground ml-2'>
							Популярные мастера
						</Text>
					</Card.Header>
					<Card.Body className='gap-3'>
						{filteredMasters?.map((master) => (
							<MasterCard key={master.id} master={master} />
						))}
					</Card.Body>
				</Card>
			</ScrollView>

			{shouldShowMoreRecommendedServicesButton &&
				filteredRecommendedServices && (
					<RecommendedServicesModal
						isVisible={isRecommendedServicesModalVisible}
						onClose={() => setIsRecommendedServicesModalVisible(false)}
						services={filteredRecommendedServices}
					/>
				)}
		</BasePage>
	)
}
