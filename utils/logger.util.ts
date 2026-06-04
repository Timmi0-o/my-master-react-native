/**
 * Общий цветной логгер. Создаёт логгер с тегом для отделения от остальных логов.
 * Формат: тег на цветном фоне + сообщение.
 */

const RESET = '\x1b[0m'
const RED_BG = '\x1b[41m'
const GREEN_BG = '\x1b[42m'
const YELLOW_BG = '\x1b[43m'
const BLUE_BG = '\x1b[44m'
const WHITE = '\x1b[37m'
const BLACK = '\x1b[30m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'

const formatMessage = (msg: unknown): string =>
	typeof msg === 'object' && msg !== null
		? JSON.stringify(msg, null, 2)
		: String(msg)

const SEP = '────────────────────────────────────────'
const indent = (s: string): string =>
	s
		.split('\n')
		.map((line) => `  ${line}`)
		.join('\n')

export type ILogger = {
	error: (msg: unknown) => void
	success: (msg: string) => void
	info: (msg: string | unknown) => void
	warn: (msg: string) => void
}

export const createLogger = (tag: string): ILogger => ({
	error: (msg: unknown): void => {
		console.log(
			`\n${RED_BG}${WHITE}[${tag}]${RESET}\n${RED}${SEP}${RESET}\n${RED}${indent(formatMessage(msg))}${RESET}\n`,
		)
	},
	success: (msg: string): void => {
		console.log(
			`\n${GREEN_BG}${BLACK}[${tag}]${RESET}\n${GREEN}${SEP}${RESET}\n${GREEN}${indent(msg)}${RESET}\n`,
		)
	},
	info: (msg: string | unknown): void => {
		console.log(
			`\n${BLUE_BG}${WHITE}[${tag}]${RESET}\n${CYAN}${SEP}${RESET}\n${CYAN}${indent(formatMessage(msg))}${RESET}\n`,
		)
	},
	warn: (msg: string): void => {
		console.warn(
			`\n${YELLOW_BG}${BLACK}[${tag}]${RESET}\n${YELLOW}${SEP}${RESET}\n${YELLOW}${indent(msg)}${RESET}\n`,
		)
	},
})
