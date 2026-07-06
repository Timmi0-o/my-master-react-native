import { ConfirmationModal } from '@/components/shared/ui/confirmation-modal/confirmation-modal'
import {
	ConfirmationContext,
	type IConfirmationOptions,
} from '@/hooks/use-confirmation'
import {
	useCallback,
	useMemo,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react'

type TConfirmationState = IConfirmationOptions

export function ConfirmationProvider({
	children,
}: {
	children: ReactNode
}): ReactElement {
	const [confirmationState, setConfirmationState] =
		useState<TConfirmationState | null>(null)

	const isOpen = Boolean(confirmationState)

	const closeConfirmation = useCallback((): void => {
		setConfirmationState(null)
	}, [])

	const confirm = useCallback((options: IConfirmationOptions): void => {
		setConfirmationState(options)
	}, [])

	const handleConfirm = useCallback((): void => {
		if (!confirmationState) return

		confirmationState.onConfirm()
		closeConfirmation()
	}, [closeConfirmation, confirmationState])

	const handleCancel = useCallback((): void => {
		if (!confirmationState) return

		confirmationState.onCancel?.()
		closeConfirmation()
	}, [closeConfirmation, confirmationState])

	const contextValue = useMemo(
		() => ({
			confirm,
		}),
		[confirm],
	)

	return (
		<ConfirmationContext.Provider value={contextValue}>
			{children}
			<ConfirmationModal
				isOpen={isOpen}
				title={confirmationState?.title ?? ''}
				description={confirmationState?.description ?? ''}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				primaryLabel={confirmationState?.primaryLabel}
				cancelLabel={confirmationState?.cancelLabel}
				status={confirmationState?.status}
			/>
		</ConfirmationContext.Provider>
	)
}
