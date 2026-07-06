import { IMasterService } from '@/actions/master-service/models/master-service.schema'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import {
	ECurrency,
	formatPriceByCurrency,
} from '@/utils/format-price-by-currency'
import { Card } from 'heroui-native'
import { Pressable, Text } from 'react-native'

export function ServiceItem({ service }: { service: IMasterService }) {
	const { t: tUi } = useScopedTranslation('ui')

	return (
		<Card>
			<Card.Body className='gap-2'>
				<Pressable className='gap-1'>
					<Text className='text-base font-semibold text-foreground'>
						{service.name}
					</Text>
					<Text className='text-sm text-muted' numberOfLines={2}>
						{service.description}
					</Text>
					<Text className='text-sm text-foreground'>
						{formatPriceByCurrency(service.price, ECurrency.RUB)} ·{' '}
						{tUi('durationMinutes', { count: service.durationMinutes ?? 0 })}
					</Text>
				</Pressable>
			</Card.Body>
		</Card>
	)
}
