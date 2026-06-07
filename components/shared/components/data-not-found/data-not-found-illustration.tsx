import { useThemeColor } from 'heroui-native'
import type { ReactElement } from 'react'
import Svg, { Circle, Path, Rect } from 'react-native-svg'

const ILLUSTRATION_SIZE_DEFAULT = 168
const ILLUSTRATION_SIZE_COMPACT = 120

interface IDataNotFoundIllustrationProps {
	compact?: boolean
}

export function DataNotFoundIllustration({
	compact = false,
}: IDataNotFoundIllustrationProps): ReactElement {
	const illustrationSize = compact
		? ILLUSTRATION_SIZE_COMPACT
		: ILLUSTRATION_SIZE_DEFAULT
	const [accentColor, borderColor, mutedColor, surfaceColor] = useThemeColor([
		'accent',
		'border',
		'muted',
		'surface',
	])

	return (
		<Svg
			height={illustrationSize}
			viewBox='0 0 168 168'
			width={illustrationSize}
		>
			<Circle cx='132' cy='36' fill={accentColor} opacity={0.12} r='28' />
			<Circle cx='36' cy='124' fill={accentColor} opacity={0.08} r='34' />

			<Rect
				fill={surfaceColor}
				height='88'
				rx='20'
				stroke={borderColor}
				strokeWidth='1.5'
				width='112'
				x='28'
				y='40'
			/>

			<Rect fill={mutedColor} height='8' opacity={0.35} rx='4' width='56' x='44' y='58' />
			<Rect fill={mutedColor} height='8' opacity={0.25} rx='4' width='72' x='44' y='74' />
			<Rect fill={mutedColor} height='8' opacity={0.18} rx='4' width='48' x='44' y='90' />

			<Circle
				cx='108'
				cy='108'
				fill={surfaceColor}
				r='22'
				stroke={accentColor}
				strokeWidth='2'
			/>
			<Path
				d='M118 118 L128 128'
				fill='none'
				stroke={accentColor}
				strokeLinecap='round'
				strokeWidth='2.5'
			/>
			<Circle
				cx='108'
				cy='108'
				fill='none'
				r='10'
				stroke={accentColor}
				strokeWidth='2'
			/>
		</Svg>
	)
}
