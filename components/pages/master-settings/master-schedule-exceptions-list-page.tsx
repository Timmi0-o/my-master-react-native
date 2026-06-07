import type { IMasterProfile } from '@/actions/master/models/master-profile.schema'
import { BasePage } from '@/components/shared/components/base-page'
import { DataNotFound } from '@/components/shared/components/data-not-found/data-not-found'
import {
	resolveLocale,
	toDateTimeLocale,
} from '@/configs/i18n/supported-locales'
import { useEnumLabel } from '@/configs/i18n/use-enum-label'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { useMasterScheduleExceptionDelete } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-delete'
import { useMasterScheduleExceptionGetMany } from '@/hooks/actions/master-schedule-exception/use-master-schedule-exception-get-many'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Button, Card, Chip } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ScheduleScreenHeader } from './schedule-screen-header'

interface IMasterScheduleExceptionsListPageProps {
	masterProfile: IMasterProfile
}

export function MasterScheduleExceptionsListPage({
	masterProfile,
}: IMasterScheduleExceptionsListPageProps): ReactElement {
	const router = useRouter()

	const { t, i18n } = useScopedTranslation('pages', 'masterSettings')
	const { t: tCommon } = useScopedTranslation('common')
	const { t: tBtn } = useScopedTranslation('ui', 'button')

	const exceptionKindLabel = useEnumLabel('enums.exceptionKind')
	const dateTimeLocale = toDateTimeLocale(resolveLocale(i18n.language))

	const { data = [], isLoading } = useMasterScheduleExceptionGetMany(
		masterProfile.id,
	)
	const deleteMutation = useMasterScheduleExceptionDelete(masterProfile.id)

	const formatDateTime = (iso: string): string =>
		new Date(iso).toLocaleString(dateTimeLocale)

	return (
		<BasePage>
			<ScheduleScreenHeader
				extraContent={
					<Button
						isIconOnly
						size='sm'
						variant='primary'
						onPress={() =>
							router.push('/master-settings/schedule-exceptions/edit')
						}
					>
						<Ionicons name='add' size={24} color='white' />
					</Button>
				}
				title={t('exceptionsListTitle')}
			/>

			{isLoading ? (
				<Text className='text-muted'>{tCommon('loading')}</Text>
			) : (
				<View style={{ rowGap: 12 }}>
					{data.map((item) => (
						<Card key={item.id}>
							<Card.Body className='gap-2'>
								<Text className='font-semibold text-foreground'>
									{item.title ?? exceptionKindLabel(item.kind)}
								</Text>
								<Chip color='default'>{exceptionKindLabel(item.kind)}</Chip>
								<Text className='text-sm text-muted'>
									{formatDateTime(item.startsAt)} —{' '}
									{formatDateTime(item.endsAt)}
								</Text>
								{item.kind === 'CUSTOM_HOURS' &&
								item.customStartTime &&
								item.customEndTime ? (
									<Text className='text-sm text-muted'>
										{t('customHours', {
											start: item.customStartTime,
											end: item.customEndTime,
										})}
									</Text>
								) : null}
								<View className='flex-row gap-2'>
									<Button
										size='sm'
										variant='outline'
										onPress={() =>
											router.push({
												pathname: '/master-settings/schedule-exceptions/edit',
												params: { id: item.id },
											})
										}
									>
										<Button.Label>{tBtn('edit')}</Button.Label>
									</Button>
									<Button
										size='sm'
										variant='danger'
										onPress={() => void deleteMutation.mutateAsync(item.id)}
										isDisabled={deleteMutation.isPending}
									>
										<Button.Label>{tBtn('delete')}</Button.Label>
									</Button>
								</View>
							</Card.Body>
						</Card>
					))}
					{!data.length ? (
						<DataNotFound message={t('emptyExceptions')} />
					) : null}
				</View>
			)}
		</BasePage>
	)
}
