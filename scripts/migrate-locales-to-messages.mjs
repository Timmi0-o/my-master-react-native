import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RN_ROOT = path.resolve(__dirname, '..')
const NEXT_ROOT = path.resolve(RN_ROOT, '..', 'my-master-next-app')
const LOCALES_DIR = path.join(RN_ROOT, 'locales')
const MESSAGES_DIR = path.join(RN_ROOT, 'messages')
const NEXT_MESSAGES_DIR = path.join(NEXT_ROOT, 'messages')

const I18N_NAMESPACES = new Set(['common', 'pages', 'ui', 'errors', 'stores', 'action-errors'])

const isPlainObject = (value) =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const writeJson = (filePath, data) => {
	mkdirSync(path.dirname(filePath), { recursive: true })
	writeFileSync(filePath, `${JSON.stringify(data, null, '\t')}\n`, 'utf8')
}

const splitAuthPages = (locale, authValue) => {
	for (const [section, sectionValue] of Object.entries(authValue)) {
		writeJson(
			path.join(MESSAGES_DIR, locale, 'pages', 'auth', `${section}.json`),
			sectionValue,
		)
	}
}

const splitNamespaceObject = (locale, namespace, value) => {
	if (namespace === 'pages' && isPlainObject(value.auth)) {
		splitAuthPages(locale, value.auth)
		const { auth: _auth, ...rest } = value
		for (const [key, sectionValue] of Object.entries(rest)) {
			writeJson(
				path.join(MESSAGES_DIR, locale, namespace, `${key}.json`),
				sectionValue,
			)
		}
		return
	}

	for (const [key, sectionValue] of Object.entries(value)) {
		const payload =
			typeof sectionValue === 'string' || typeof sectionValue === 'number'
				? sectionValue
				: sectionValue

		writeJson(
			path.join(MESSAGES_DIR, locale, namespace, `${key}.json`),
			payload,
		)
	}
}

const migrateLocale = (locale) => {
	const localeDir = path.join(LOCALES_DIR, locale)
	if (!existsSync(localeDir)) return

	const common = JSON.parse(
		readFileSync(path.join(localeDir, 'common.json'), 'utf8'),
	)

	if (existsSync(path.join(NEXT_MESSAGES_DIR, locale, 'action-errors'))) {
		delete common.actionErrors
	}

	writeJson(path.join(MESSAGES_DIR, locale, 'common.json'), common)

	for (const namespace of ['pages', 'ui']) {
		const filePath = path.join(localeDir, `${namespace}.json`)
		if (!existsSync(filePath)) continue
		splitNamespaceObject(
			locale,
			namespace,
			JSON.parse(readFileSync(filePath, 'utf8')),
		)
	}
}

const copyActionErrorsFromNext = (locale) => {
	const sourceDir = path.join(NEXT_MESSAGES_DIR, locale, 'action-errors')
	const targetDir = path.join(MESSAGES_DIR, locale, 'action-errors')
	if (!existsSync(sourceDir)) return

	cpSync(sourceDir, targetDir, { recursive: true })
}

const copyErrorsFromNext = (locale) => {
	const sourceDir = path.join(NEXT_MESSAGES_DIR, locale, 'errors')
	const targetDir = path.join(MESSAGES_DIR, locale, 'errors')
	if (!existsSync(sourceDir)) return

	cpSync(sourceDir, targetDir, { recursive: true })
}

const locales = readdirSync(LOCALES_DIR).filter((entry) =>
	statSync(path.join(LOCALES_DIR, entry)).isDirectory(),
)

if (existsSync(MESSAGES_DIR)) {
	rmSync(MESSAGES_DIR, { recursive: true, force: true })
}

for (const locale of locales) {
	migrateLocale(locale)
	copyActionErrorsFromNext(locale)
	copyErrorsFromNext(locale)
}

console.log(
	`[i18n] migrated ${locales.length} locales to ${path.relative(RN_ROOT, MESSAGES_DIR)}`,
)
