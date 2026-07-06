import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { authStore } from '../../stores/auth/auth.store'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		authStore.hydrate().catch(() => {})
	}, [])

	return children
}
