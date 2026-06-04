import { useRouter, useSegments } from 'expo-router'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { activeProfileModeStorage } from './active-profile-mode-storage'
import type { ActiveProfileMode } from './active-profile-mode.types'

interface IActiveProfileModeContextValue {
	mode: ActiveProfileMode
	setMode: (mode: ActiveProfileMode) => Promise<void>
}

const ActiveProfileModeContext =
	createContext<IActiveProfileModeContextValue | null>(null)

export const ActiveProfileModeProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [mode, setModeState] = useState<ActiveProfileMode>('client')
	const router = useRouter()
	const segments = useSegments()

	useEffect(() => {
		activeProfileModeStorage
			.readMode()
			.then((persisted) => {
				if (persisted) {
					setModeState(persisted)
				}
			})
			.catch(() => {})
	}, [])

	const setMode = useCallback(
		async (nextMode: ActiveProfileMode): Promise<void> => {
			setModeState(nextMode)
			await activeProfileModeStorage.writeMode(nextMode)

			if (nextMode === 'master' && (segments as string[]).includes('search')) {
				router.replace('/(tabs)/general')
			}
		},
		[router, segments],
	)

	const value = useMemo<IActiveProfileModeContextValue>(
		() => ({
			mode,
			setMode,
		}),
		[mode, setMode],
	)

	return (
		<ActiveProfileModeContext.Provider value={value}>
			{children}
		</ActiveProfileModeContext.Provider>
	)
}

export const useActiveProfileMode = (): IActiveProfileModeContextValue => {
	const context = useContext(ActiveProfileModeContext)
	if (!context) {
		throw new Error(
			'useActiveProfileMode must be used within ActiveProfileModeProvider',
		)
	}
	return context
}
