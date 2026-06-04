import { MasterDetail } from '@/components/pages/master/master-detail/master-detail'
import { useMasterProfileGetOne } from '@/hooks/actions/master/use-master-profile-get-one'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MasterProfileScreen(): ReactElement {
	const router = useRouter()
	const insets = useSafeAreaInsets()
	const { id } = useLocalSearchParams<{ id: string }>()
	const masterProfileId = Array.isArray(id) ? id[0] : (id ?? '')
	const { data, isLoading, error } = useMasterProfileGetOne(masterProfileId)

	if (isLoading) {
		return (
			<View
				className='flex-1 items-center justify-center bg-background'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-muted'>Загрузка профиля...</Text>
			</View>
		)
	}

	if (error?.message || !data) {
		return (
			<View
				className='flex-1 items-center justify-center gap-3 bg-background px-6'
				style={{ paddingTop: insets.top }}
			>
				<Text className='text-center text-foreground'>
					{error?.message ?? 'Профиль мастера не найден'}
				</Text>
				<Button variant='outline' onPress={() => router.back()}>
					<Button.Label>Назад</Button.Label>
				</Button>
			</View>
		)
	}

	return <MasterDetail master={data} />
}
