import { execSync } from 'node:child_process'

try {
	execSync('adb reverse tcp:9010 tcp:9010', { stdio: 'ignore' })
	console.log('[adb] MinIO port reversed: emulator localhost:9010 -> host localhost:9010')
} catch {
	console.warn('[adb] Skip MinIO port reverse (no device or adb unavailable)')
}
