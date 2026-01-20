/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Esto forzará la fuente en todo
      },
			colors: {
        // Definimos tus colores aquí para que Tailwind los entienda
        'arg-dark': '#0b1116',
        'arg-card': '#161f29',
        'arg-celeste': '#75AADB',
        'arg-sol': '#F4B942',
      }
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}