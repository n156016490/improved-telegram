import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#00D084',
        'sky-blue': '#00B8E6',
        charcoal: '#1a1a1a',
        slate: '#6B7280',
      },
    },
  },
  plugins: [],
}
export default config
