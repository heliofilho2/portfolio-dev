import type { Config } from 'tailwindcss'

/**
 * Configuração do Tailwind CSS
 * 
 * Baseado no HTML fornecido, configuramos:
 * - Cores: primary (#0F172A), accent (#3B82F6)
 * - Fontes: Inter (sans), JetBrains Mono (mono)
 * - Dark mode: class-based
 * 
 * POR QUÊ essas cores?
 * - Primary: Slate escuro (profissional, técnico)
 * - Accent: Azul vibrante (destaque, links)
 * - Backgrounds: Claro e escuro para dark mode
 */
const config: Config = {
  darkMode: 'class', // Ativado via classe (não auto)
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores do tema baseadas no HTML
        primary: '#0F172A',        // Slate escuro
        accent: '#3B82F6',         // Azul vibrante
        'background-light': '#F8FAFC',
        'background-dark': '#020617',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
export default config
