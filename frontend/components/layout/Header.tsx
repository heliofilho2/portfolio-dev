'use client'

/**
 * Header Component
 * * Baseado no HTML fornecido:
 * - Logo com inicial "H"
 * - Status operacional (Available)
 * - Navegação com tabs
 * - Toggle dark/light mode
 * * POR QUÊ 'use client'?
 * - Precisa de interatividade (toggle dark mode)
 * - Usa useState para gerenciar estado
 * - Client Component necessário
 */

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { profileApi, type ProfileDto } from '@/lib/api'

export default function Header() {
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<string>('overview')
  
  // POR QUÊ useState(false)?
  // - Padrão é light mode (modo branco)
  // - false = light mode, true = dark mode
  const [isDark, setIsDark] = useState(false)

  // Buscar perfil para exibir nome e role
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileApi.get()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }
    fetchProfile()
  }, [])

  // Detectar hash atual e atualizar tab ativa
  useEffect(() => {
    const updateActiveTab = () => {
      if (pathname === '/about') {
        setActiveTab('about')
        return
      }
      
      if (pathname === '/') {
        const hash = window.location.hash
        if (hash === '#projects') {
          setActiveTab('projects')
        } else if (hash === '#experience') {
          setActiveTab('experience')
        } else if (hash === '#contact') {
          setActiveTab('contact')
        } else {
          setActiveTab('overview')
        }
      }
    }

    // Atualiza imediatamente
    updateActiveTab()
    
    // Escuta mudanças de hash
    const handleHashChange = () => {
      setTimeout(updateActiveTab, 100) // Pequeno delay para garantir que o hash mudou
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    // Escuta cliques nos links (para atualizar imediatamente)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link) {
        const href = link.getAttribute('href')
        if (href === '/about') {
          setTimeout(() => setActiveTab('about'), 50)
        } else if (href?.startsWith('/#')) {
          const hash = href.substring(1)
          setTimeout(() => {
            if (hash === '#projects') setActiveTab('projects')
            else if (hash === '#experience') setActiveTab('experience')
            else if (hash === '#contact') setActiveTab('contact')
          }, 50)
        } else if (href === '/') {
          setTimeout(() => setActiveTab('overview'), 50)
        }
      }
    }
    
    document.addEventListener('click', handleClick, true)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleClick, true)
    }
  }, [pathname])

  // POR QUÊ useEffect?
  // - Executa após render (não pode acessar localStorage durante SSR)
  // - Sincroniza com preferência salva (se existir)
  // - Padrão: light mode (não verifica preferência do sistema)
  useEffect(() => {
    // Verifica apenas preferência salva (não sistema)
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Se tem preferência salva, usa ela
    // Se não tem, respeita a preferência do sistema
    if (saved === 'dark' || (!saved && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    const html = document.documentElement
    
    if (newIsDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Logo e Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Logo com inicial - Design mais identitário */}
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent via-blue-600 to-accent text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white dark:border-slate-800">
                H
              </div>
              {/* Efeito de brilho ao hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight">
                {profile?.name || 'Helio Filho'}
              </span>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                {profile?.role || 'Technical Lead / SAP B1 Specialist'}
              </div>
            </div>
          </div>
          
          {/* Status Operacional */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Operational Status: Available
            </span>
          </div>
        </div>

        {/* Navegação e Dark Mode Toggle */}
        <nav className="flex items-center gap-4">
          {/* Tabs de Navegação */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-accent'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/#projects"
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === 'projects'
                  ? 'bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-accent'
              }`}
            >
              Deployments
            </Link>
            <Link
              href="/#experience"
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === 'experience'
                  ? 'bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-accent'
              }`}
            >
              History
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-accent'
              }`}
            >
              About
            </Link>
            <Link
              href="/#contact"
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                activeTab === 'contact'
                  ? 'bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-accent'
              }`}
            >
              Terminal
            </Link>
          </div>

          {/* Dark Mode Toggle - usando SVGs em vez de Material Symbols para evitar texto aparecendo */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? (
              // Ícone de sol (modo claro ativo)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Ícone de lua (modo escuro disponível)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}