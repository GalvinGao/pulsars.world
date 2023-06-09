const defaultConfig = require('tailwindcss/defaultConfig')
const formsPlugin = require('@tailwindcss/forms')

/** @type {import('tailwindcss/types').Config} */
const config = {
	content: ['index.html', 'src/**/*.tsx'],
	theme: {
		fontFamily: {
			sans: ['IBM Plex Sans', ...defaultConfig.theme.fontFamily.sans],
			mono: ['IBM Plex Mono', ...defaultConfig.theme.fontFamily.mono]
		},
		extend: {
			transitionDuration: {
				DEFAULT: '100ms'
			}
		}
	},
	experimental: { optimizeUniversalDefaults: true },
	plugins: [formsPlugin]
}
module.exports = config
