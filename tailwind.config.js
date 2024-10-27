/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx,scss}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				blue167: '#1677ff',
				blue1f5: '#1F5CB8',
				blue307: '#3073D7',
				blue004: '#004EC2',
				blue65A: '#65A1FA',
				'header-blue': '#65A1FA',
				'button-blue': '#3073D7',
				'content-gray': '#F5F8FB',
				'dasha-blue': '#1F5CB8',
				'dasha-light-blue': '#3073D7',
				'hover-gray-blue': '#E3E8ED',
				'text-gray': '#909090',
				'button-blue-hover': '#3483F9',
				'button-focus-border-blue': '#045ADB'
			},
			screens: {
				'test': {'min': '0px', 'max': '1580px'}
				// тестовые медиа запросик
			},
			fontFamily: {
				'main-font': ['"Open Sans"', 'sans-serif'],
				'content-font': ['"PT Sans"', 'sans-serif']
			},
			boxShadow: {
				'custom-shadow': '0 0 19px 0 rgba(212, 227, 241, 0.6)'
			},
		}
	},
	corePlugins: {
		preflight: false
	},
	plugins: []
}
