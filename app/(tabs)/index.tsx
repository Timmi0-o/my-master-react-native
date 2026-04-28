import ProfilePage from '@/components/pages/profile/profile-page'
import { useUserGetOne } from '@/hooks/actions/user/use-user-get-one'
import { Text } from 'react-native'

export default function Profile() {
	const { data, isLoading, error } = useUserGetOne('1')

	if (error?.message) {
		return <Text>Error: {error.message}</Text>
	}

	if (isLoading) {
		return <Text>Loading...</Text>
	}

	if (!data) {
		return <Text>No data</Text>
	}

	return <ProfilePage data={data} />
}
