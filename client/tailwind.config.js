/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },

  purge: false,

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    fontFamily: {
      display: ['Noto Sans', 'sans-serif'],
      body: ['Noto Sans', 'sans-serif'],
    },
    extend: {
      // fontFamily: {
      //   sans: 'var(--font-roboto)',
      // },
      colors: {
        gray: {
          50: '#eaeaea',
          100: '#D6D6D6',
          200: '#c2c2c2',
          300: '#A3A3A3',
          400: '#8F8F8F',
          500: '#7A7A7A',
          600: '#28282d',
          700: '#1f1f23',
          800: '#18181b',
          900: '#121215',
        },
        red: {
          100: '#FEE0AE',
          200: '#FED89A',
          300: '#FEC872',
          400: '#FDB849',
          500: '#FCA311',
          600: '#F29602',
          700: '#DE8A02',
        },
        // blue: {},
      },
    },
  },
  variants: {},
  plugins: [],
});
