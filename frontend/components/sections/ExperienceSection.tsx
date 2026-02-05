'use client'

/**
 * Seção de Experiência Profissional
 * * Baseado no HTML fornecido:
 * - Timeline vertical
 * - Experiências ordenadas por data
 * - Card de console/terminal
 */

import { useState, useEffect } from 'react'
import { experiencesApi, profileApi, type ExperienceDto, type ProfileDto } from '@/lib/api'

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<ExperienceDto[]>([])
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [experiencesData, profileData] = await Promise.all([
          experiencesApi.getAll().catch(() => []), // Se falhar, retorna array vazio
          profileApi.get().catch(() => null), // Se falhar, continua sem profile
        ])
        // Garantir que experiencesData seja sempre um array
        setExperiences(Array.isArray(experiencesData) ? experiencesData : [])
        setProfile(profileData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setExperiences([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6" id="experience">
      {/* Timeline de Experiências - 2 colunas */}
      <div className="lg:col-span-2 metric-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Professional History
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Carregando experiências...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Nenhuma experiência cadastrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
            {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-10">
              {/* Ponto na timeline */}
              <div
                className={`
                  absolute left-0 top-1.5 w-6 h-6 rounded-full 
                  ${exp.isCurrent ? 'bg-white dark:bg-slate-900 border-2 border-accent' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800'}
                  flex items-center justify-center
                `}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    exp.isCurrent ? 'bg-accent' : 'bg-slate-400'
                  }`}
                ></div>
              </div>

              {/* Conteúdo */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h4 className="font-bold">{exp.title}</h4>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {exp.endDate
                    ? `${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`
                    : `${formatDate(exp.startDate)} — PRESENT`}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{exp.description}</p>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Card de Console/Terminal - 1 coluna */}
      {/* CORREÇÃO: Inversão de cores para Light/Dark mode.
          Antes era forçado bg-slate-950 (escuro).
          Agora: bg-slate-50 (claro) no light mode, dark:bg-slate-950 no dark mode.
          Texto: text-slate-900 no light, dark:text-white no dark.
      */}
      <div className="metric-card bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-1">
            System Console
          </h2>
          <div className="h-1 w-12 bg-accent rounded-full"></div>
        </div>

        <div className="space-y-4 font-mono text-[11px] leading-relaxed">
          <div className="flex gap-2">
            <span className="text-emerald-500 font-bold">$</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">helio_filho --status</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-800 pl-3">
            {profile?.location && <>&gt; Location: {profile.location}<br /></>}
            {profile?.role && <>&gt; Role: {profile.role}<br /></>}
            {profile?.specialized && <>&gt; Specialized: {profile.specialized}<br /></>}
            {profile?.certifications && <>&gt; Certs: {profile.certifications}</>}
            {!profile && (
              <>
                &gt; Location: MG, Brazil<br />
                &gt; Role: Senior Dev<br />
                &gt; Specialized: ERP/FinTech<br />
                &gt; Certs: SAP B1 Certified SDK
              </>
            )}
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-500 font-bold">$</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {profile?.name?.toLowerCase().replace(/\s+/g, '_') || 'helio_filho'} --get-contact
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-400 border-l border-slate-300 dark:border-slate-800 pl-3">
            {profile?.email && <>&gt; Email: {profile.email}<br /></>}
            {profile?.gitHubUrl && <>&gt; GitHub: {profile.gitHubUrl.replace('https://github.com/', '/')}<br /></>}
            {profile?.linkedInUrl && <>&gt; LinkedIn: {profile.linkedInUrl.replace('https://www.linkedin.com/in/', '/')}</>}
            {!profile && (
              <>
                &gt; Email: contact@heliofilho.dev<br />
                &gt; GitHub: /helio-f<br />
                &gt; LinkedIn: /heliofilho
              </>
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="4" width="18" height="14" rx="2" ry="2" strokeWidth="2" />
                <path d="M7 9l3 3-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold">SYSTEM READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}