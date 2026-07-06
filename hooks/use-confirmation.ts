import { createContext, useContext } from 'react'

export type TConfirmationStatus =
	| 'default'
	| 'accent'
	| 'success'
	| 'warning'
	| 'danger'

export interface IConfirmationOptions {
	onConfirm: () => void
	onCancel?: () => void
	title: string
	description: string
	primaryLabel?: string
	cancelLabel?: string
	status?: TConfirmationStatus
}

interface IConfirmationContextValue {
	confirm: (options: IConfirmationOptions) => void
}

export const ConfirmationContext = createContext<IConfirmationContextValue | null>(
	null,
)

export const useConfirmation = (): IConfirmationContextValue['confirm'] => {
	const context = useContext(ConfirmationContext)

	if (!context) {
		throw new Error('useConfirmation must be used inside ConfirmationProvider')
	}

	return context.confirm
}
