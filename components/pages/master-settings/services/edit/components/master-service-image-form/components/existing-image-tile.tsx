import type { IMasterServiceImage } from '@/actions/master-service/models/master-service.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { resolveFileUrlForClient } from '@/utils/resolve-file-url-for-client.util'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, Text, View } from 'react-native'

const IMAGE_SIZE = 120

interface IExistingImageTileProps {
	image: IMasterServiceImage
	isMarkedForDelete: boolean
	onToggleDelete: () => void
}

export function ExistingImageTile({
	image,
	isMarkedForDelete,
	onToggleDelete,
}: IExistingImageTileProps): ReactElement {
	const { t } = useScopedTranslation('pages', 'masterSettings')
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const dangerColor = useThemeColor('danger')
	const uri = resolveFileUrlForClient(image.file?.fileUrl ?? '')

	if (!uri) return <View style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} />

	return (
		<View style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
			<Pressable
				accessibilityRole='button'
				accessibilityState={{ selected: isMarkedForDelete }}
				className='overflow-hidden rounded-xl active:opacity-90'
				onPress={onToggleDelete}
			>
				<Image
					source={{ uri }}
					style={{
						width: IMAGE_SIZE,
						height: IMAGE_SIZE,
						opacity: isMarkedForDelete ? 0.4 : 1,
					}}
					contentFit='cover'
				/>
				{isMarkedForDelete ? (
					<View className='absolute inset-0 items-center justify-center bg-background/30'>
						<Text className='text-sm font-semibold text-danger'>
							{t('photoMarkedForDeletion')}
						</Text>
					</View>
				) : null}
			</Pressable>
			{!isMarkedForDelete ? (
				<Pressable
					accessibilityLabel={tBtn('delete')}
					accessibilityRole='button'
					className='absolute right-1 top-1 rounded-full bg-background/90 p-1 active:opacity-80'
					onPress={onToggleDelete}
				>
					<Ionicons color={dangerColor} name='close' size={16} />
				</Pressable>
			) : null}
		</View>
	)
}
