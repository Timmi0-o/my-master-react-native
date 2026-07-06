import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import type { ReactElement, ReactNode } from 'react'

interface IMasterServiceEditHeaderProps {
	title: string
	rightContent?: ReactNode
}

export function MasterServiceEditHeader({
	title,
	rightContent,
}: IMasterServiceEditHeaderProps): ReactElement {
	return <BasePageHeader title={title} rightContent={rightContent} />
}
