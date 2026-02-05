'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { profileApi, type ProfileDto } from '@/lib/api'

export default function AboutPage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileApi.get()
        if (data) {
          console.log('Profile data completo:', JSON.stringify(data, null, 2)) // Debug completo
          console.log('AboutText value:', data.aboutText) // Debug específico
          console.log('AboutText type:', typeof data.aboutText) // Debug tipo
          console.log('AboutText length:', data.aboutText?.length) // Debug tamanho
        }
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-28 pb-20 px-6 max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Carregando...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 max-w-[1600px] mx-auto">
        {/* Seção de Foto e Nome */}
        <div className="mb-12 metric-card">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Foto - Usa avatar-abt.jpeg específico para About */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-slate-200 dark:border-slate-800 shadow-xl">
                <img
                  src="/avatar-abt.jpeg"
                  alt={profile?.name || 'Helio Filho'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback se a imagem não carregar
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"><div class="text-8xl">👨‍💻</div></div>'
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Nome e Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
                {profile?.name || 'Helio Filho'}
              </h1>
              {profile?.role && (
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 font-bold">
                  {profile.role}
                </p>
              )}
              {profile?.location && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card Principal */}
          <div className="lg:col-span-2 metric-card">
            <div className="mb-6">
              <h2 className="text-2xl font-black mb-2 tracking-tight">About Me</h2>
              <div className="h-1 w-16 bg-accent rounded-full"></div>
            </div>

            {/* Descrição Profissional */}
            {profile?.description && (
              <div className="mb-8">
                <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-3">
                  Professional Overview
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profile.description}
                  </p>
                </div>
              </div>
            )}

            {/* Texto Pessoal/Humano */}
            {profile?.aboutText && profile.aboutText.trim() !== '' ? (
              <div className="mb-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-3">
                  Beyond the Code
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {profile.aboutText}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Informações Adicionais */}
            <div className="mt-8 space-y-4">
              {profile?.specialized && (
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Specialized
                  </h3>
                  <p className="text-sm font-bold">{profile.specialized}</p>
                </div>
              )}

              {profile?.certifications && (
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                    Certifications
                  </h3>
                  <p className="text-sm">{profile.certifications}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar com Stats */}
          <div className="space-y-6">
            <div className="metric-card">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                Quick Stats
              </h2>
              <div className="space-y-4">
                {profile?.experienceYears && (
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-400">Experience</span>
                    <span className="text-sm font-black">{profile.experienceYears}</span>
                  </div>
                )}
                {profile?.coreEngine && (
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-mono text-slate-400">Core Stack</span>
                    <span className="text-sm font-bold text-right max-w-[60%]">{profile.coreEngine}</span>
                  </div>
                )}
                {profile?.database && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">Database</span>
                    <span className="text-sm font-bold text-right max-w-[60%]">{profile.database}</span>
                  </div>
                )}
              </div>
            </div>

            {profile?.location && (
              <div className="metric-card">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Location
                </h2>
                <p className="text-sm font-bold">{profile.location}</p>
                {profile.languages && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{profile.languages}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
