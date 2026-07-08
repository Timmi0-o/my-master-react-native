import { useAuth } from '@/stores/auth'
import { Redirect } from 'expo-router'
import { observer } from 'mobx-react'
import type { ReactElement } from 'react'

function IndexScreen(): ReactElement | null {
	const { state } = useAuth()

	if (state.status === 'loading') {
		return null
	}

	if (state.status === 'authenticated') {
		return <Redirect href='/(tabs)/general' />
	}

	return <Redirect href='/(auth)/sign-in' />
}

export default observer(IndexScreen)
