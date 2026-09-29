'use client'

import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeToggle() {
  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-stone-500 hover:text-ink hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      aria-label="Alternar tema claro/escuro"
    >
      <FiMoon className="w-4 h-4 dark:hidden" />
      <FiSun className="w-4 h-4 hidden dark:block" />
    </button>
  )
}
