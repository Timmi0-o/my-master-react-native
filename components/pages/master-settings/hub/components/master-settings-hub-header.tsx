import { BasePageHeader } from '@/components/pages/components/base-page-header/base-page-header'
import type { ReactElement } from 'react'

interface IMasterSettingsHubHeaderProps {
	title: string
}

export function MasterSettingsHubHeader({
	title,
}: IMasterSettingsHubHeaderProps): ReactElement {
	return <BasePageHeader title={title} />
}
