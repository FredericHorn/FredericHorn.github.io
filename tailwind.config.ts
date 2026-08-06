import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f5',
          100: '#edecea',
          200: '#dbd9d4',
          300: '#c4c0b8',
          400: '#a9a49a',
          500: '#958e82',
          600: '#887f74',
          700: '#726961',
          800: '#5e5751',
          900: '#4d4844',
          950: '#282523',
        },
        chalk: {
          DEFAULT: '#faf9f7',
          warm: '#f5f3ef',
        },
        accent: {
          DEFAULT: '#1a5c3a',
          light: '#2a7a52',
          dark: '#0e3d25',
          muted: '#e8f0ec',
        },
        theorem: '#8b4513',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        math: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'reading': '65ch',
        'wide': '80ch',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#4d4844',
            '--tw-prose-headings': '#282523',
            '--tw-prose-links': '#1a5c3a',
            maxWidth: '65ch',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            h1: {
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.015em',
            },
            h3: {
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: '600',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.875em',
              backgroundColor: '#edecea',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'draw-line': 'drawLine 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
