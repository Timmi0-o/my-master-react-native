import type { IGlassWrapperProps } from '@/components/shared/ui/glass-wrapper/glass-wrapper.types'
import { GlassWrapperFallback } from '@/components/shared/ui/glass-wrapper/glass-wrapper-fallback'
import type { ReactElement } from 'react'

export type { IGlassWrapperProps } from '@/components/shared/ui/glass-wrapper/glass-wrapper.types'

export function GlassWrapper(props: IGlassWrapperProps): ReactElement {
	return <GlassWrapperFallback {...props} />
}
