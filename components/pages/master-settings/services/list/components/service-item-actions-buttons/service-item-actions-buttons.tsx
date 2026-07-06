import { Ionicons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

export const SERVICE_ITEM_ACTIONS_WIDTH = 100
export const SERVICE_ITEM_ACTIONS_GAP = 8

interface IServiceItemActionButtonsProps {
	onEdit: () => void
	onDelete: () => void
}

export function ServiceItemActionButtons({
	onEdit,
	onDelete,
}: IServiceItemActionButtonsProps): ReactElement {
	return (
		<View
			style={{
				flexDirection: 'row',
				gap: 4,
				width: SERVICE_ITEM_ACTIONS_WIDTH,
			}}
		>
			<Button
				size='sm'
				variant='tertiary'
				onPress={onEdit}
				isIconOnly
				style={{ flex: 1 }}
			>
				<Ionicons name='pencil' size={20} color='currentColor' />
			</Button>

			<Button
				size='sm'
				variant='danger'
				onPress={onDelete}
				isIconOnly
				style={{ flex: 1 }}
			>
				<Button.Label>
					<Ionicons name='trash' size={20} color='currentColor' />
				</Button.Label>
			</Button>
		</View>
	)
}
