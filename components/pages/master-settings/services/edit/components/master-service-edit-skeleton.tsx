import { BasePage } from '@/components/shared/components/base-page/base-page'
import { BasePageLoader } from '@/components/shared/components/base-page-loader/base-page-loader'
import type { ReactElement } from 'react'

export function MasterServiceEditSkeleton(): ReactElement {
	return (
		<BasePage>
			<BasePageLoader variant='form' />
		</BasePage>
	)
}
