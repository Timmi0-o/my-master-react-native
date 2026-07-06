import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import type { ReactElement, ReactNode } from 'react'

interface IMasterBookingSettingsHeaderProps {
	title: string
	rightContent?: ReactNode
}

export function MasterBookingSettingsHeader({
	title,
	rightContent,
}: IMasterBookingSettingsHeaderProps): ReactElement {
	return <BasePageHeader title={title} rightContent={rightContent} />
}
