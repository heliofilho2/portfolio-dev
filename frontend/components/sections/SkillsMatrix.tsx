'use client'

import { useState, useEffect } from 'react'
import { skillsApi, type SkillDto } from '@/lib/api'

const categoryLabels: Record<number, string> = {
  1: 'Backend Systems',
  2: 'Enterprise Systems',
  3: 'Data & Performance',
  4: 'Integration & Infrastructure',
}

export default function SkillsMatrix() {
  const [skills, setSkills] = useState<SkillDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await skillsApi.getAll().catch(() => []) // Se falhar, retorna array vazio
        // Garantir que data seja sempre um array
        setSkills(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching skills:', err)
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<number, SkillDto[]>)

  const categories = [1, 2, 3, 4]

  return (
    /* CORREÇÃO: Fundo escuro específico para o card de matrix */
    <div className="lg:col-span-8 metric-card bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          Technical Skill Matrix
        </h2>
        <span className="text-[10px] font-mono text-slate-400">LAST_UPDATE: 2026</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
              {categoryLabels[category]}
            </h3>
            {skillsByCategory[category]?.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* CORREÇÃO: Fundo da barra de progresso no dark mode */}
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono w-8">{skill.proficiency}%</span>
                </div>
                <span className="block text-[11px] font-bold">{skill.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}