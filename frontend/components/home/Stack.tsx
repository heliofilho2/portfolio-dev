import type { SkillDto } from '@/lib/api'

const categoryLabels: Record<number, string> = {
  1: 'Backend',
  2: 'SAP Business One',
  3: 'Dados & Performance',
  4: 'Integração & Infra',
}

export default function Stack({ skills }: { skills: SkillDto[] }) {
  if (skills.length === 0) return null

  const byCategory = skills.reduce<Record<number, SkillDto[]>>((acc, skill) => {
    ;(acc[skill.category] ??= []).push(skill)
    return acc
  }, {})

  return (
    <section id="stack" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Stack</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {Object.keys(categoryLabels)
          .map(Number)
          .filter((category) => byCategory[category]?.length)
          .map((category) => (
            <div key={category}>
              <h3 className="text-sm font-bold mb-3">{categoryLabels[category]}</h3>
              <div className="flex flex-wrap gap-1.5">
                {byCategory[category]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((skill) => (
                    <span
                      key={skill.id}
                      className="text-xs px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
