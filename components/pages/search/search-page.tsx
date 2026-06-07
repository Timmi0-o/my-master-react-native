import { FieldTypes } from '@/actions/base-models/filters/field-types.schema'
import { RecommendedServicesModal } from '@/components/pages/search/components/modals/recommended-services-modal/recommended-services-modal'
import { SEARCH_RECOMMENDED_SERVICES_PREVIEW_LIMIT } from '@/components/pages/search/data/search-recommended-services.constants'
import { BasePage } from '@/components/shared/components/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import { MasterCard } from '@/components/shared/components/master-card/master-card'
import { ServiceCard } from '@/components/shared/components/service-card/service-card'
import {
	GlassInputShell,
	GlassSearchFieldInput,
} from '@/components/shared/ui/glass-input/glass-input'
import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterServiceGetMany } from '@/hooks/actions/master-service/use-master-service-get-many'
import { useMasterProfileGetMany } from '@/hooks/actions/master/use-master-profile-get-many'
import { useDebounce } from '@/hooks/use-debounce'
import { useManageSearchParams } from '@/hooks/use-manage-search-params'
import { useQuerySynchronization } from '@/hooks/use-query-synchronization'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
	Avatar,
	Button,
	Card,
	SearchField,
	Typography,
	useThemeColor,
} from 'heroui-native'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View, type ViewStyle } from 'react-native'

const RECOMMENDED_SERVICE_CARD_STYLE: ViewStyle = { width: 220 }
const VIEW_MORE_BUTTON_STYLE: ViewStyle = { minHeight: 88, width: 120 }

const SEARCH_QUERY_DEBOUNCE_MS = 500

export const SearchPage = () => {
	const { t } = useScopedTranslation('pages', 'search')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const { t: tPlaceholder } = useScopedTranslation('ui', 'placeholder')
	const { searchParams, handlePushKeyInSearchParams } = useManageSearchParams()

	const search = searchParams.search ?? ''

	const [draftSearch, setDraftSearch] = useState<string | null>(
		() => search as string,
	)

	const debouncedDraftSearch = useDebounce(
		draftSearch,
		SEARCH_QUERY_DEBOUNCE_MS,
	)

	useQuerySynchronization({
		key: 'search',
		keyType: FieldTypes.SEARCH,
		setValue: (value) => {
			const next = (value as string).trim() || null
			setDraftSearch(next)
		},
	})

	useEffect(() => {
		const nextValue = debouncedDraftSearch?.trim() || null
		const currentValue = (search as string)?.trim() || null

		if (nextValue === currentValue) return

		handlePushKeyInSearchParams({
			key: 'search',
			value: nextValue,
		})
	}, [debouncedDraftSearch, search, handlePushKeyInSearchParams])

	const [
		isRecommendedServicesModalVisible,
		setIsRecommendedServicesModalVisible,
	] = useState(false)

	const foregroundColor = useThemeColor('foreground')

	const { data: masters, isLoading: isMastersLoading } =
		useMasterProfileGetMany()

	const { data: recommendedServices, isLoading: isServicesLoading } =
		useMasterServiceGetMany()

	const shouldShowMoreRecommendedServicesButton =
		(recommendedServices?.length ?? 0) >
		SEARCH_RECOMMENDED_SERVICES_PREVIEW_LIMIT

	return (
		<BasePage>
			<ScrollView contentContainerClassName='gap-3'>
				<View className='mx-2 flex-row items-center gap-2 justify-between'>
					<Typography.Heading type='h2' style={{ opacity: 0.85 }}>
						My Master
					</Typography.Heading>

					<GlassWrapper
						onPress={() => router.push('/(tabs)')}
						style={{ borderRadius: 999, zIndex: 1000 }}
					>
						<Avatar>
							<Avatar.Fallback />
						</Avatar>
					</GlassWrapper>
				</View>

				<SearchField
					value={draftSearch ?? ''}
					onChange={(nextValue) => setDraftSearch(nextValue)}
				>
					<GlassInputShell
						style={{
							minHeight: 60,
							maxWidth: '96%',
							marginHorizontal: 'auto',
							zIndex: 1000,
						}}
					>
						<SearchField.Group>
							<SearchField.SearchIcon />
							<GlassSearchFieldInput
								placeholder={tPlaceholder('searchServices')}
							/>
							<SearchField.ClearButton />
						</SearchField.Group>
					</GlassInputShell>
				</SearchField>

				<Card className='gap-2'>
					<Card.Header>
						<Text className='text-2xl font-bold text-foreground ml-2'>
							{t('recommendedForYou')}
						</Text>
					</Card.Header>
					<Card.Body className='mt-1 p-0'>
						{recommendedServices?.length ? (
							<ScrollView
								horizontal
								contentContainerClassName='gap-3 pr-2'
								showsHorizontalScrollIndicator={false}
							>
								{recommendedServices?.map((service) => (
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
										<Button.Label>{tBtn('more')}</Button.Label>
									</Button>
								)}
							</ScrollView>
						) : isServicesLoading ? (
							<Text className='ml-2 text-base text-muted'>
								{t('loadingServices')}
							</Text>
						) : (
							<DataNotFound compact message={t('servicesNotFound')} />
						)}
					</Card.Body>
				</Card>

				<Card className='gap-2'>
					<Card.Header>
						<Text className='text-2xl font-bold text-foreground ml-2'>
							{t('popularMasters')}
						</Text>
					</Card.Header>
					<Card.Body className='gap-3'>
						{isMastersLoading && !masters?.length ? (
							<Text className='text-base text-muted ml-2'>
								{t('loadingMasters')}
							</Text>
						) : null}
						{masters?.map((master) => (
							<MasterCard key={master.id} master={master} />
						))}
						{!isMastersLoading && masters?.length === 0 ? (
							<DataNotFound compact message={t('mastersNotFound')} />
						) : null}
					</Card.Body>
				</Card>
			</ScrollView>

			{shouldShowMoreRecommendedServicesButton && recommendedServices && (
				<RecommendedServicesModal
					isVisible={isRecommendedServicesModalVisible}
					onClose={() => setIsRecommendedServicesModalVisible(false)}
					services={recommendedServices}
				/>
			)}
		</BasePage>
	)
}
