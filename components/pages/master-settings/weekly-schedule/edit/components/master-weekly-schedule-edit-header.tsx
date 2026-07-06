import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import type { ReactElement, ReactNode } from 'react'

interface IMasterWeeklyScheduleEditHeaderProps {
	title: string
	rightContent?: ReactNode
}

export function MasterWeeklyScheduleEditHeader({
	title,
	rightContent,
}: IMasterWeeklyScheduleEditHeaderProps): ReactElement {
	return <BasePageHeader title={title} rightContent={rightContent} />
}
