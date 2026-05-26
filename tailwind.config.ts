import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper:      '#FAF3E4',
        ink:        '#2C1A0A',
        grain:      '#5C3620',
        terracotta: '#C4893C',
        sepia:      '#9E7A4A',
        herb:       '#7A9B6A',
        wheat:      '#DDB843',
      },
      fontFamily: {
        display: ['"Ma Shan Zheng"', '"Noto Serif SC"', 'serif'],
        serif:   ['"Noto Serif SC"', 'Georgia', 'serif'],
        mono:    ['"Courier Prime"', 'Courier New', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '4px 6px 20px rgba(58, 36, 21, 0.18)',
        'card-lg': '8px 12px 32px rgba(58, 36, 21, 0.22)',
      },
      backgroundImage: {
        texture: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
