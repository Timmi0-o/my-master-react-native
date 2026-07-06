import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import { Ionicons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'

interface IMasterScheduleExceptionsListHeaderProps {
	title: string
	onAddPress: () => void
}

export function MasterScheduleExceptionsListHeader({
	title,
	onAddPress,
}: IMasterScheduleExceptionsListHeaderProps): ReactElement {
	return (
		<BasePageHeader
			title={title}
			rightContent={
				<Button isIconOnly size='sm' variant='primary' onPress={onAddPress}>
					<Ionicons name='add' size={24} color='white' />
				</Button>
			}
		/>
	)
}
