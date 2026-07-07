import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IMasterServicesListHeaderProps {
	title: string
	isEditMode: boolean
	onAddPress: () => void
	onEditModeChange: (value: boolean) => void
	onEditSubmit: () => void
}

export function MasterServicesListHeader({
	title,
	isEditMode,
	onAddPress,
	onEditModeChange,
	onEditSubmit,
}: IMasterServicesListHeaderProps): ReactElement {
	const { t: tBtn } = useScopedTranslation('ui', 'button')

	const handleEditPress = (): void => {
		if (isEditMode) {
			onEditSubmit()
			return
		}

		onEditModeChange(true)
	}

	return (
		<BasePageHeader
			title={title}
			rightContent={
				<View className='flex-row items-center gap-2'>
					<Button isIconOnly size='sm' variant='primary' onPress={onAddPress}>
						<Ionicons color='white' name='add' size={22} />
					</Button>
					<Button size='sm' variant='tertiary' onPress={handleEditPress}>
						<Button.Label>
							{isEditMode ? tBtn('done') : tBtn('editShort')}
						</Button.Label>
					</Button>
				</View>
			}
		/>
	)
}
