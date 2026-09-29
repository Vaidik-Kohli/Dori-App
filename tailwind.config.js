tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bgLight: '#FBF3E4',
        bgDark: '#1F1412',
        surfaceLight: '#F3E6CC',
        surfaceDark: '#2B1B18',
        surfaceCardDark: '#2B1B18',
        borderLight: '#d9bd94',
        borderDark: '#482825',
        borderStrongLight: '#6B4A42',
        borderStrongDark: '#C2A88F',

        primary: 'rgb(var(--primary) / <alpha-value>)',
        onPrimary: 'rgb(var(--on-primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        onSecondary: 'rgb(var(--on-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        emergency: 'rgb(var(--emergency) / <alpha-value>)',
        onEmergency: 'rgb(var(--on-emergency) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        textMuted: 'rgb(var(--text-muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        borderStrong: 'rgb(var(--border-strong) / <alpha-value>)',
        
        // temporary aliases until full replace
        alert: 'rgb(var(--emergency) / <alpha-value>)',
      },
      boxShadow: {
        'card-hover': '0 20px 25px -5px rgb(var(--shadow-color) / 0.15), 0 10px 10px -5px rgb(var(--shadow-color) / 0.05)',
        'btn-3d': '0 8px 0 rgb(var(--edge-primary)), 0 15px 20px rgb(var(--shadow-color) / 0.15)',
        'btn-3d-active': '0 2px 0 rgb(var(--edge-primary)), 0 5px 10px rgb(var(--shadow-color) / 0.1)',
        'btn-3d-alert': '0 8px 0 rgb(var(--edge-emergency)), 0 15px 20px rgb(var(--shadow-color) / 0.15)',
        'btn-3d-alert-active': '0 2px 0 rgb(var(--edge-emergency)), 0 5px 10px rgb(var(--shadow-color) / 0.1)',
        'btn-3d-secondary': '0 8px 0 rgb(var(--edge-secondary)), 0 15px 20px rgb(var(--shadow-color) / 0.15)',
        'btn-3d-secondary-active': '0 2px 0 rgb(var(--edge-secondary)), 0 5px 10px rgb(var(--shadow-color) / 0.1)',
      }
    },
  },
};


