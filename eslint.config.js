// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
	expoConfig,
	{
		ignores: ['dist/*'],

		rules: {
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': 'error',
		},
	},
])
