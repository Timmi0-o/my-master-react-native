import { useEffect, useState } from 'react'
import { Keyboard, Platform, type KeyboardEvent } from 'react-native'

const KEYBOARD_SHOW_EVENT =
	Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
const KEYBOARD_HIDE_EVENT =
	Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

/**
 * Возвращает true, пока на экране открыта системная клавиатура.
 * На iOS — `keyboardWill*`, чтобы стейт менялся вместе с анимацией клавиатуры.
 */
export const useKeyboardVisibility = (): boolean => {
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

	useEffect(() => {
		const handleShow = (_event: KeyboardEvent): void => {
			setIsKeyboardVisible(true)
		}

		const handleHide = (): void => {
			setIsKeyboardVisible(false)
		}

		const showSubscription = Keyboard.addListener(
			KEYBOARD_SHOW_EVENT,
			handleShow,
		)
		const hideSubscription = Keyboard.addListener(
			KEYBOARD_HIDE_EVENT,
			handleHide,
		)

		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	return isKeyboardVisible
}
