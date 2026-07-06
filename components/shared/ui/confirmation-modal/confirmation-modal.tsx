import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import type { TConfirmationStatus } from '@/hooks/use-confirmation'
import { Button, Dialog } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

interface IConfirmationModalProps {
	isOpen: boolean
	title: string
	description: string
	onConfirm: () => void
	onCancel: () => void
	primaryLabel?: string
	cancelLabel?: string
	status?: TConfirmationStatus
}

export function ConfirmationModal({
	isOpen,
	title,
	description,
	onConfirm,
	onCancel,
	primaryLabel,
	cancelLabel,
	status = 'accent',
}: IConfirmationModalProps): ReactElement {
	const { t: tBtn } = useScopedTranslation('ui', 'button')
	const isDangerStatus = status === 'danger'

	const handleOpenChange = (nextIsOpen: boolean): void => {
		if (!nextIsOpen) {
			onCancel()
		}
	}

	return (
		<Dialog isOpen={isOpen} onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<View className='mb-5 gap-1.5'>
						<Dialog.Title>{title}</Dialog.Title>
						<Dialog.Description>{description}</Dialog.Description>
					</View>
					<View className='flex-row justify-end gap-3'>
						<Button size='sm' variant='ghost' onPress={onCancel}>
							<Button.Label>{cancelLabel ?? tBtn('cancel')}</Button.Label>
						</Button>
						<Button
							size='sm'
							variant={isDangerStatus ? 'danger' : 'primary'}
							onPress={onConfirm}
						>
							<Button.Label>{primaryLabel ?? tBtn('confirm')}</Button.Label>
						</Button>
					</View>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	)
}
