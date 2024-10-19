/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#b22222', // Red inspired by the logo
				secondary: '#ffd700', // Gold inspired by the logo
				accent: '#228b22', // Green inspired by Indian theme
			},
			fontFamily: {
				heading: ['Cormorant Garamond', 'serif'],
				body: ['Poppins', 'sans-serif'],
			},
		},
		screens: {
			'xs': '0px',
			'sm': '576px',
			'md': '768px',
			'lg': '992px',
			'xl': '1280px',
			'2xl': '1536px'
		},
	},
	darkMode: 'selector',
	plugins: [],
}
