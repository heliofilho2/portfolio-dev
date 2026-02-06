'use client'

import { useState, useEffect } from 'react'
import SkillsMatrix from './SkillsMatrix'
import { profileApi, resumeApi, type ProfileDto } from '@/lib/api'

export default function HeroSection() {
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileApi.get()
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4 metric-card flex items-center justify-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Carregando perfil...</p>
        </div>
        <SkillsMatrix />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4 metric-card flex items-center justify-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Perfil não encontrado.</p>
        </div>
        <SkillsMatrix />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      <div className="lg:col-span-4 metric-card flex flex-col justify-between overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">👨‍💻</div>
              )}
            </div>
            <div className="text-right">
              {profile.location && (
                <div className="text-xs font-mono text-slate-400">LOC: {profile.location}</div>
              )}
              {profile.languages && (
                <div className="text-xs font-mono text-slate-400">LANG: {profile.languages}</div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-black mb-2 tracking-tight">{profile.role}</h1>
          {profile.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {profile.description}
            </p>
          )}

          <div className="space-y-2">
            {profile.experienceYears && (
              <div className="flex justify-between text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Experience</span>
                <span className="font-bold">{profile.experienceYears}</span>
              </div>
            )}
            {profile.coreEngine && (
              <div className="flex justify-between text-xs font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-400">Core Engine</span>
                <span className="font-bold">{profile.coreEngine}</span>
              </div>
            )}
            {profile.database && (
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Database</span>
                <span className="font-bold">{profile.database}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex gap-2">
            <a
              href="#contact"
              className="flex-1 bg-accent hover:bg-blue-600 text-white text-center py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest"
            >
              Execute Contact
            </a>
            {/* CORREÇÃO: Borda no dark mode */}
            <a
              href="#projects"
              className="flex-1 border border-slate-200 dark:border-slate-700 text-center py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest"
            >
              Stack Audit
            </a>
          </div>
          <div className="flex gap-2">
            <a
              href={resumeApi.downloadEn()}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent text-center py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Resume (EN)
            </a>
            <a
              href={resumeApi.downloadPt()}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent text-center py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              CV (PT-BR)
            </a>
          </div>
        </div>
      </div>

      <SkillsMatrix />
    </div>
  )
}