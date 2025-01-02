import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite/**/*.js',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				greenForest: '#2f9f6e'
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: [flowbitePlugin]
} as Config;
