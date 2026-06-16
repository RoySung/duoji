import {heroui} from "@heroui/react";
import defaultTheme from 'tailwindcss/defaultTheme';

// const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
// For example
// ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	darkMode: 'class',
	content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
    //     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['jf-openhuninn', ...defaultTheme.fontFamily.sans],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
		heroui({
			defaultTheme: 'light',
			defaultExtendTheme: 'light',
			themes: {
				light: {
					colors: {
						background: 'hsl(0 0% 100%)',
						foreground: 'hsl(0 0% 3.9%)',
						content1: {
							DEFAULT: '#ffffff',
							foreground: '#11181c'
						},
						content2: {
							DEFAULT: '#f4f4f5',
							foreground: '#27272a'
						},
						content3: {
							DEFAULT: '#e4e4e7',
							foreground: '#3f3f46'
						},
						content4: {
							DEFAULT: '#d4d4d8',
							foreground: '#52525b'
						},
						default: {
							50: '#fafafa',
							100: '#f4f4f5',
							200: '#e4e4e7',
							300: '#d4d4d8',
							400: '#a1a1aa',
							500: '#71717a',
							600: '#52525b',
							700: '#3f3f46',
							800: '#27272a',
							900: '#18181b',
							DEFAULT: 'hsl(0 0% 96.1%)',
							foreground: 'hsl(0 0% 9%)'
						},
						primary: {
							50: '#fff7ed',
							100: '#ffedd5',
							200: '#fed7aa',
							300: '#fdba74',
							400: '#fb923c',
							500: '#f97316',
							600: '#ea580c',
							700: '#c2410c',
							800: '#9a3412',
							900: '#7c2d12',
							DEFAULT: 'hsl(24 96% 61%)',
							foreground: 'hsl(0 0% 98%)'
						},
						secondary: {
							50: '#fafaf9',
							100: '#f5f5f4',
							200: '#e7e5e4',
							300: '#d6d3d1',
							400: '#a8a29e',
							500: '#78716c',
							600: '#57534e',
							700: '#44403c',
							800: '#292524',
							900: '#1c1917',
							DEFAULT: 'hsl(0 0% 96.1%)',
							foreground: 'hsl(0 0% 9%)'
						},
						success: {
							50: '#f0fdf4',
							100: '#dcfce7',
							200: '#bbf7d0',
							300: '#86efac',
							400: '#4ade80',
							500: '#22c55e',
							600: '#16a34a',
							700: '#15803d',
							800: '#166534',
							900: '#14532d',
							DEFAULT: '#16a34a',
							foreground: '#ffffff'
						},
						warning: {
							50: '#fffbeb',
							100: '#fef3c7',
							200: '#fde68a',
							300: '#fcd34d',
							400: '#fbbf24',
							500: '#f59e0b',
							600: '#d97706',
							700: '#b45309',
							800: '#92400e',
							900: '#78350f',
							DEFAULT: '#f59e0b',
							foreground: '#111827'
						},
						danger: {
							50: '#fef2f2',
							100: '#fee2e2',
							200: '#fecaca',
							300: '#fca5a5',
							400: '#f87171',
							500: '#ef4444',
							600: '#dc2626',
							700: '#b91c1c',
							800: '#991b1b',
							900: '#7f1d1d',
							DEFAULT: 'hsl(0 84.2% 60.2%)',
							foreground: 'hsl(0 0% 98%)'
						},
						focus: 'hsl(24 96% 61%)'
					}
				},
				dark: {
					colors: {
						background: '#141414',
						foreground: 'hsl(0 0% 98%)',
						content1: {
							DEFAULT: '#18181b',
							foreground: '#fafafa'
						},
						content2: {
							DEFAULT: '#27272a',
							foreground: '#f4f4f5'
						},
						content3: {
							DEFAULT: '#3f3f46',
							foreground: '#e4e4e7'
						},
						content4: {
							DEFAULT: '#52525b',
							foreground: '#d4d4d8'
						},
						default: {
							50: '#18181b',
							100: '#27272a',
							200: '#3f3f46',
							300: '#52525b',
							400: '#71717a',
							500: '#a1a1aa',
							600: '#d4d4d8',
							700: '#e4e4e7',
							800: '#f4f4f5',
							900: '#fafafa',
							DEFAULT: '#3f3f46',
							foreground: 'hsl(0 0% 98%)'
						},
						primary: {
							50: '#fff7ed',
							100: '#ffedd5',
							200: '#fed7aa',
							300: '#fdba74',
							400: '#fb923c',
							500: '#f97316',
							600: '#ea580c',
							700: '#c2410c',
							800: '#9a3412',
							900: '#7c2d12',
							DEFAULT: 'hsl(24 96% 61%)',
							foreground: 'hsl(0 0% 9%)'
						},
						secondary: {
							50: '#fafaf9',
							100: '#f5f5f4',
							200: '#e7e5e4',
							300: '#d6d3d1',
							400: '#a8a29e',
							500: '#78716c',
							600: '#57534e',
							700: '#44403c',
							800: '#292524',
							900: '#1c1917',
							DEFAULT: 'hsl(0 0% 14.9%)',
							foreground: 'hsl(0 0% 98%)'
						},
						success: {
							50: '#f0fdf4',
							100: '#dcfce7',
							200: '#bbf7d0',
							300: '#86efac',
							400: '#4ade80',
							500: '#22c55e',
							600: '#16a34a',
							700: '#15803d',
							800: '#166534',
							900: '#14532d',
							DEFAULT: '#22c55e',
							foreground: '#052e16'
						},
						warning: {
							50: '#fffbeb',
							100: '#fef3c7',
							200: '#fde68a',
							300: '#fcd34d',
							400: '#fbbf24',
							500: '#f59e0b',
							600: '#d97706',
							700: '#b45309',
							800: '#92400e',
							900: '#78350f',
							DEFAULT: '#fbbf24',
							foreground: '#451a03'
						},
						danger: {
							50: '#fef2f2',
							100: '#fee2e2',
							200: '#fecaca',
							300: '#fca5a5',
							400: '#f87171',
							500: '#ef4444',
							600: '#dc2626',
							700: '#b91c1c',
							800: '#991b1b',
							900: '#7f1d1d',
							DEFAULT: 'hsl(0 62.8% 30.6%)',
							foreground: 'hsl(0 0% 98%)'
						},
						focus: 'hsl(24 96% 61%)'
					}
				}
			}
		})
  ],
};
