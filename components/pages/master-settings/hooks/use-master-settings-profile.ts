import { useMasterProfileGetMine } from '@/hooks/actions/master/use-master-profile-get-mine'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export const useMasterSettingsProfile = () => {
	const router = useRouter()
	const { data: masterProfile, isLoading, error } = useMasterProfileGetMine()

	useEffect(() => {
		if (!isLoading && !masterProfile && !error) {
			router.replace('/(tabs)')
		}
	}, [isLoading, masterProfile, error, router])

	return { masterProfile, isLoading, error }
}
