import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { resolveFileUrlForClient } from '@/utils/resolve-file-url-for-client.util'
import { Image } from 'expo-image'
import type { ReactElement } from 'react'
import { ScrollView, View } from 'react-native'

interface IMasterServiceGalleryProps {
	service: IMasterService
}

export function MasterServiceGallery({
	service,
}: IMasterServiceGalleryProps): ReactElement | null {
	const images = (service.images ?? [])
		.map((image) => resolveFileUrlForClient(image.file?.fileUrl ?? ''))
		.filter((uri): uri is string => Boolean(uri))

	if (!images.length) return null

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false}>
			<View className='flex-row gap-3'>
				{images.map((uri) => (
					<Image
						key={uri}
						source={{ uri }}
						style={{ width: 280, height: 200, borderRadius: 16 }}
						contentFit='cover'
					/>
				))}
			</View>
		</ScrollView>
	)
}
