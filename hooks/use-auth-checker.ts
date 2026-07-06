import { useAuth } from '@/stores/auth'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export function useAuthChecker() {
	const { isAuthenticated, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			router.push('/(auth)/sign-in')
		}
	}, [isAuthenticated, isLoading, router])
}
