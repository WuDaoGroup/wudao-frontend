module.exports = {
	purge: ['./src/**/*.html', './src/**/*.svelte'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		styled: true,
		themes: [
			'emerald', // first one will be the default theme
			'dark',
			'forest',
			'synthwave'
		],
		base: true,
		utils: true,
		logs: true,
		rtl: false
	}
};
