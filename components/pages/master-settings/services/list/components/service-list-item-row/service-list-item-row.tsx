import type { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useEffect, useState, type ReactElement } from 'react'
import { Pressable, View, type LayoutChangeEvent } from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import {
	SERVICE_ITEM_ACTIONS_GAP,
	SERVICE_ITEM_ACTIONS_WIDTH,
	ServiceItemActionButtons,
} from '../service-item-actions-buttons/service-item-actions-buttons'
import { ServiceItem } from '../service-item/service-item'

const ANIMATION_DURATION = 150
const ACTIONS_SHIFT = SERVICE_ITEM_ACTIONS_WIDTH + SERVICE_ITEM_ACTIONS_GAP

interface IServiceListItemRowProps {
	service: IMasterService
	isEditMode: boolean
	onEdit: () => void
	onDelete: () => void
}

export function ServiceListItemRow({
	service,
	isEditMode,
	onEdit,
	onDelete,
}: IServiceListItemRowProps): ReactElement {
	const [containerWidth, setContainerWidth] = useState(0)

	const translateX = useSharedValue(isEditMode ? -ACTIONS_SHIFT : 0)

	useEffect(() => {
		translateX.value = withTiming(isEditMode ? -ACTIONS_SHIFT : 0, {
			duration: ANIMATION_DURATION,
		})
	}, [isEditMode, translateX])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}))

	const handleLayout = (event: LayoutChangeEvent) => {
		const nextWidth = event.nativeEvent.layout.width
		if (nextWidth !== containerWidth) {
			setContainerWidth(nextWidth)
		}
	}

	return (
		<View onLayout={handleLayout} style={{ overflow: 'hidden' }}>
			{containerWidth > 0 ? (
				<Animated.View
					style={[
						{
							flexDirection: 'row',
							alignItems: 'center',
							width: containerWidth + ACTIONS_SHIFT,
						},
						animatedStyle,
					]}
				>
					<Pressable onPress={onEdit} style={{ flex: 1 }}>
						<ServiceItem service={service} />
					</Pressable>

					<View
						pointerEvents={isEditMode ? 'auto' : 'none'}
						style={{
							width: ACTIONS_SHIFT,
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: SERVICE_ITEM_ACTIONS_GAP,
						}}
					>
						<ServiceItemActionButtons onEdit={onEdit} onDelete={onDelete} />
					</View>
				</Animated.View>
			) : (
				<ServiceItem service={service} />
			)}
		</View>
	)
}
