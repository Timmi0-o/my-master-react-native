import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'

interface IMasterServicesListHeaderProps {
	title: string
	isEditMode: boolean
	onEditModeChange: (value: boolean) => void
	onEditSubmit: () => void
}

export function MasterServicesListHeader({
	title,
	isEditMode,
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
				<Button size='sm' variant='tertiary' onPress={handleEditPress}>
					<Button.Label>
						{isEditMode ? tBtn('done') : tBtn('editShort')}
					</Button.Label>
				</Button>
			}
		/>
	)
}
