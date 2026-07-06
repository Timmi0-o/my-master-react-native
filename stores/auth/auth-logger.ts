type LogArg = unknown

const enabled = __DEV__

const format = (level: string, args: LogArg[]) => [`[auth:${level}]`, ...args]

export const authLog = {
	action: (...args: LogArg[]) => {
		if (enabled) console.log(...format('action', args))
	},
	info: (...args: LogArg[]) => {
		if (enabled) console.log(...format('info', args))
	},
	success: (...args: LogArg[]) => {
		if (enabled) console.log(...format('success', args))
	},
	warn: (...args: LogArg[]) => {
		if (enabled) console.warn(...format('warn', args))
	},
	error: (...args: LogArg[]) => {
		if (enabled) console.error(...format('error', args))
	},
}
