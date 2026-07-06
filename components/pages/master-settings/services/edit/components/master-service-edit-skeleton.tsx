import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import { BasePage } from '@/components/shared/components/base-page/base-page'
import { BackButton } from '@/components/shared/ui/back-button/back-button'
import { Skeleton } from 'heroui-native'
import type { ReactElement } from 'react'
import { View } from 'react-native'

const FORM_FIELD_COUNT = 4

export function MasterServiceEditSkeleton(): ReactElement {
	return (
		<BasePage>
			<BasePageHeader
				leftContent={<BackButton />}
				rightContent={<View style={{ width: 44 }} />}
				title=''
				titleContent={
					<View className='items-center'>
						<Skeleton className='h-6 w-40 rounded-full' />
					</View>
				}
			/>

			<View className='mb-4 flex-row gap-2'>
				<Skeleton className='h-10 flex-1 rounded-full' />
				<Skeleton className='h-10 flex-1 rounded-full' />
			</View>

			<View className='gap-4 rounded-2xl border border-border bg-surface p-4'>
				{Array.from({ length: FORM_FIELD_COUNT }).map((_, index) => (
					<View key={index} className='gap-2'>
						<Skeleton className='h-4 w-24 rounded-full' />
						<Skeleton className='h-12 w-full rounded-xl' />
					</View>
				))}

				<Skeleton className='mt-2 h-12 w-full rounded-xl' />
			</View>
		</BasePage>
	)
}
