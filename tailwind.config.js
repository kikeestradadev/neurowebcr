/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,pug}',
		'./public/**/*.html',
	],
	theme: {
		screens: {
			s: '0px',
			sm: '480px',
			m: '640px',
			l: '960px',
			lg: '1280px',
			xl: '1600px',
			xxl: '1920px',
		},
		extend: {
			colors: {
				nw: {
					bg: 'var(--nw-bg)',
					surface: 'var(--nw-surface)',
					'surface-muted': 'var(--nw-surface-muted)',
					text: 'var(--nw-text)',
					'text-muted': 'var(--nw-text-muted)',
					accent: 'var(--nw-accent)',
					'band-bg': 'var(--nw-band-bg)',
					'band-surface': 'var(--nw-band-surface)',
					'band-text': 'var(--nw-band-text)',
				},
			},
			fontFamily: {
				sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
				secondary: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
			},
			boxShadow: {
				card: '0 4px 24px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 20px 48px rgba(0, 0, 0, 0.12)',
			},
		},
	},
	plugins: [],
	future: {
		hoverOnlyWhenSupported: true,
	},
};
