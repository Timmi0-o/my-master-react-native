import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import type { ReactElement, ReactNode } from 'react'

interface IMasterScheduleExceptionEditHeaderProps {
	title: string
	rightContent?: ReactNode
}

export function MasterScheduleExceptionEditHeader({
	title,
	rightContent,
}: IMasterScheduleExceptionEditHeaderProps): ReactElement {
	return <BasePageHeader title={title} rightContent={rightContent} />
}
