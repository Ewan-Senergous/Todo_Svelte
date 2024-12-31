import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite/**/*.js'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: [flowbitePlugin]
} as Config;
