import type { ExtractedNavigationTabTrigger } from '@/components/shared/ui/navigation-tab/navigation-tab.types'
import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from 'react'

type TriggerComponent = ReactElement<{
	name: string
	children?: ReactNode
}>

const isTriggerElement = (
	child: ReactNode,
	Trigger: unknown,
): child is TriggerComponent =>
	isValidElement(child) && child.type === Trigger

const isLabelElement = (child: ReactNode, Label: unknown): boolean =>
	isValidElement(child) && child.type === Label

const isIconElement = (
	child: ReactNode,
	Icon: unknown,
): child is ReactElement<ExtractedNavigationTabTrigger['icon']> =>
	isValidElement(child) && child.type === Icon

export const extractTabTriggers = (
	children: ReactNode,
	Trigger: unknown,
	Label: unknown,
	Icon: unknown,
): ExtractedNavigationTabTrigger[] => {
	const triggers: ExtractedNavigationTabTrigger[] = []

	Children.forEach(children, (child) => {
		if (!isTriggerElement(child, Trigger)) {
			return
		}

		let label = ''
		let icon: ExtractedNavigationTabTrigger['icon'] = {}

		Children.forEach(child.props.children, (subChild) => {
			if (!isValidElement(subChild)) {
				return
			}

			if (isLabelElement(subChild, Label)) {
				label = String(
					(subChild.props as { children?: string }).children ?? '',
				)
				return
			}

			if (isIconElement(subChild, Icon)) {
				icon = subChild.props
			}
		})

		triggers.push({
			name: child.props.name,
			label,
			icon,
		})
	})

	return triggers
}
