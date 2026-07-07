import { GlassWrapper } from '@/components/shared/ui/glass-wrapper/glass-wrapper'
import { useScopedTranslation } from '@/configs/i18n/use-scoped-translation'
import { Ionicons } from '@expo/vector-icons'
import { Spinner, useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import { Text } from 'react-native'

interface ISaveButtonProps {
	isDisabled?: boolean
	isIconOnly?: boolean
	isLoading?: boolean
	onPress: () => void
}

export function SaveButton({
	isDisabled = false,
	isIconOnly = false,
	isLoading = false,
	onPress,
}: ISaveButtonProps): ReactElement {
	const { t: tBtn } = useScopedTranslation('ui', 'button')

	const accentForegroundColor = useThemeColor('accent-foreground')

	const accentColor = useThemeColor('accent')

	const label = isLoading ? tBtn('saving') : tBtn('save')

	return (
		<GlassWrapper
			contentContainerStyle={
				isIconOnly
					? {
							alignItems: 'center',
							height: 44,
							justifyContent: 'center',
							width: 44,
						}
					: {
							alignItems: 'center',
							columnGap: 8,
							flexDirection: 'row',
							justifyContent: 'center',
							minHeight: 44,
							paddingHorizontal: 16,
							paddingVertical: 10,
						}
			}
			glassEffectStyle='regular'
			isDisabled={isDisabled}
			onPress={onPress}
			style={{ borderRadius: 999 }}
			tintColor={accentColor}
		>
			{isLoading ? (
				<Spinner size='sm' color={accentForegroundColor} />
			) : (
				<Ionicons name='save-outline' size={20} color={accentForegroundColor} />
			)}
			{!isIconOnly ? (
				<Text
					className='font-semibold text-base'
					style={{ color: accentForegroundColor }}
				>
					{label}
				</Text>
			) : null}
		</GlassWrapper>
	)
}
