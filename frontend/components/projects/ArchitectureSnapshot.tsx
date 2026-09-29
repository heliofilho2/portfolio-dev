import { FiArrowRight } from 'react-icons/fi'

// Formato esperado: "ERP → Worker → Retry Engine → Alertas" (também aceita "->")
export default function ArchitectureSnapshot({ architectureNotes }: { architectureNotes?: string }) {
  const components = (architectureNotes ?? '')
    .split(/\s*(?:→|->)\s*/)
    .map((comp) => comp.trim())
    .filter(Boolean)

  if (components.length === 0) return null

  return (
    <section>
      <h2 className="section-title">Arquitetura</h2>
      <div className="card p-5 flex flex-wrap items-center gap-2">
        {components.map((component, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-mono text-xs font-bold">
              {component}
            </span>
            {index < components.length - 1 && <FiArrowRight className="w-4 h-4 text-stone-400" />}
          </div>
        ))}
      </div>
    </section>
  )
}
