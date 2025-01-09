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
			fontFamily: {
				sans: ['Poppins', 'sans-serif']
			},
			colors: {
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				},
				'red': {
					'50': '#fff0f0',
					'100': '#ffdddd',
					'200': '#ffc0c0',
					'300': '#ff9494',
					'400': '#ff5757',
					'500': '#ff2323',
					'600': '#ff0000',
					'700': '#d70000',
					'800': '#b10303',
					'900': '#920a0a',
					'950': '#500000',
				}
			}
		}
	},
	plugins: [flowbitePlugin]
} as Config;
