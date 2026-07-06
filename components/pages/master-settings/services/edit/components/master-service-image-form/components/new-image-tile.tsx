import type { ILocalImageAsset } from '@/actions/master-service/models/master-service-edit-image.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Pressable, View } from 'react-native'

const IMAGE_SIZE = 120

interface INewImageTileProps {
	asset: ILocalImageAsset
	onRemove: () => void
}

export function NewImageTile({
	asset,
	onRemove,
}: INewImageTileProps): ReactElement {
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const dangerColor = useThemeColor('danger')

	return (
		<View style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
			<Image
				source={{ uri: asset.uri }}
				style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 12 }}
				contentFit='cover'
			/>
			<Pressable
				accessibilityLabel={tBtn('delete')}
				accessibilityRole='button'
				className='absolute right-1 top-1 rounded-full bg-background/90 p-1 active:opacity-80'
				onPress={onRemove}
			>
				<Ionicons color={dangerColor} name='close' size={16} />
			</Pressable>
		</View>
	)
}
