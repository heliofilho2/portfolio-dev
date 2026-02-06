/**
 * Componente Architecture Snapshot
 * 
 * Renderiza visualmente a arquitetura do projeto.
 * Formato esperado: "ERP → Worker → Retry Engine → Alert Service → Webex"
 */

interface ArchitectureSnapshotProps {
  architectureNotes?: string;
}

export default function ArchitectureSnapshot({ architectureNotes }: ArchitectureSnapshotProps) {
  if (!architectureNotes || architectureNotes.trim() === '') {
    return null;
  }

  // Parse do formato: "A → B → C" ou "A -> B -> C"
  // Usamos um grupo de alternância em vez de classe de caracteres
  // para evitar ranges inválidos no regex.
  const components = architectureNotes
    .split(/\s*(?:→|->)\s*/)
    .map((comp) => comp.trim())
    .filter((comp) => comp.length > 0);

  if (components.length === 0) {
    return null;
  }

  return (
    <div className="metric-card p-6">
      <h3 className="text-sm font-mono text-accent uppercase tracking-tighter mb-4">
        Architecture Snapshot
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        {components.map((component, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Box do componente */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold">
              {component}
            </div>
            {/* Seta (exceto no último) */}
            {index < components.length - 1 && (
              <svg
                className="w-5 h-5 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
