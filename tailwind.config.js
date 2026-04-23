/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './blog/**/*.html',
    './admin/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // ClearMend primary — deep teal / aqua, conveys clean air & water
        primary: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Accent — fresh emerald/mint, conveys health & renewal
        accent: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Brand ink — deep oceanic navy for premium surfaces
        ink: {
          50:  '#f4f7fb',
          100: '#e6ecf4',
          200: '#c8d3e3',
          300: '#9aadc6',
          400: '#6781a6',
          500: '#48648c',
          600: '#385072',
          700: '#2e415c',
          800: '#27374d',
          900: '#111a2b',
          950: '#070c18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 40px -8px rgba(6,182,212,0.45)',
        'glow-accent':  '0 0 40px -8px rgba(16,185,129,0.45)',
        'premium': '0 30px 80px -20px rgba(7,12,24,0.35), 0 8px 24px -8px rgba(7,12,24,0.25)',
      },
      backgroundImage: {
        'grid-hero': "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
        'mesh-primary': 'radial-gradient(80% 60% at 20% 10%, rgba(34,211,238,0.35), transparent 60%), radial-gradient(60% 50% at 80% 90%, rgba(16,185,129,0.25), transparent 60%)',
      },
      animation: {
        'float':   'float 8s ease-in-out infinite',
        'blob':    'blob 18s ease-in-out infinite',
        'shimmer': 'shimmer 2.6s linear infinite',
        'spin-slow': 'spin 24s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) translateX(0)' },
          '50%':     { transform: 'translateY(-14px) translateX(6px)' },
        },
        blob: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-20px) scale(1.1)' },
          '66%':     { transform: 'translate(-20px,25px) scale(0.95)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
