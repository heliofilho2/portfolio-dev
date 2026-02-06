/**
 * Componente de Case Study do Projeto
 * 
 * Renderiza todas as seções do case study técnico:
 * - Overview
 * - Business Problem
 * - Technical Solution
 * - Technical Decisions
 * - Trade-offs
 * - Architecture Snapshot
 * - Impact Metrics
 */

import { ProjectDto } from '@/lib/api'
import ArchitectureSnapshot from './ArchitectureSnapshot'

interface ProjectCaseStudyProps {
  project: ProjectDto;
}

interface TechnicalSolutionItem {
  step?: string;
  description?: string;
  tool?: string;
  [key: string]: unknown;
}

interface TechnicalDecision {
  question?: string;
  answer?: string;
  decision?: string; // fallback se vier em outro formato
  reason?: string;
}

interface TradeOff {
  decision?: string;
  tradeoff?: string;
  tradeOff?: string;
  impact?: string;
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  // Parse JSON arrays
  const technicalSolutionRaw = project.technicalSolution
    ? (() => {
        try {
          let raw = project.technicalSolution.trim();
          
          // Tenta limpar escape duplo (\\\" -> \")
          if (raw.includes('\\\\"')) {
            raw = raw.replace(/\\\\"/g, '"');
          }
          
          // Se não começa com [, pode ser string simples ou objeto único
          if (!raw.startsWith('[') && !raw.startsWith('{')) {
            // Não é JSON válido, retorna como string simples
            return [project.technicalSolution] as Array<string | TechnicalSolutionItem>;
          }
          
          // Se começa com { mas não é array, tenta converter para array
          if (raw.startsWith('{') && !(raw.startsWith('[') && raw.length > 1 && raw[1] === '{')) {
            // Pode ser objeto único, coloca em array
            raw = '[' + raw + ']';
          }
          
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) {
            return parsed as Array<string | TechnicalSolutionItem>;
          }
          return [project.technicalSolution] as Array<string | TechnicalSolutionItem>;
        } catch (error) {
          console.warn('Failed to parse technicalSolution:', error, project.technicalSolution);
          // Se não for JSON válido, trata como string simples
          return [project.technicalSolution] as Array<string | TechnicalSolutionItem>;
        }
      })()
    : [];

  const technicalDecisions = project.technicalDecisions
    ? (() => {
        try {
          let raw = project.technicalDecisions.trim();
          
          // Tenta limpar escape duplo (\\\" -> \")
          if (raw.includes('\\\\"')) {
            raw = raw.replace(/\\\\"/g, '"');
          }
          
          // Se não começa com [, tenta adicionar (caso seja objeto único ou lista sem colchetes)
          if (!raw.startsWith('[') && !raw.startsWith('{')) {
            // Não é JSON válido, retorna vazio
            console.warn('TechnicalDecisions não é JSON válido:', raw);
            return [];
          }
          
          // Se começa com { mas não é array, tenta converter para array
          if (raw.startsWith('{') && !(raw.startsWith('[') && raw.length > 1 && raw[1] === '{')) {
            // Pode ser objeto único ou lista sem colchetes
            // Tenta adicionar colchetes
            raw = '[' + raw + ']';
          }
          
          let parsed = JSON.parse(raw);
          
          // Se não for array, tenta converter
          if (!Array.isArray(parsed)) {
            // Se for objeto único, coloca em array
            if (typeof parsed === 'object' && parsed !== null) {
              parsed = [parsed];
            } else {
              return [];
            }
          }
          
          // Normaliza os objetos para ter question/answer ou decision/reason
          return parsed.map((item: any) => {
            if (typeof item === 'string') {
              return { question: item, answer: '' };
            }
            if (typeof item === 'object' && item !== null) {
              return {
                question: item.question || item.decision || '',
                answer: item.answer || item.reason || ''
              };
            }
            return { question: '', answer: '' };
          }).filter((item: TechnicalDecision) => item.question || item.answer) as TechnicalDecision[];
        } catch (error) {
          console.warn('Failed to parse technicalDecisions:', error, project.technicalDecisions);
          return [];
        }
      })()
    : [];

  const tradeOffs = project.tradeOffs
    ? (() => {
        try {
          let raw = project.tradeOffs.trim();
          
          // Tenta limpar escape duplo (\\\" -> \")
          if (raw.includes('\\\\"')) {
            raw = raw.replace(/\\\\"/g, '"');
          }
          
          // Se não começa com [, tenta adicionar (caso seja objeto único ou lista sem colchetes)
          if (!raw.startsWith('[') && !raw.startsWith('{')) {
            // Não é JSON válido, retorna vazio
            console.warn('TradeOffs não é JSON válido:', raw);
            return [];
          }
          
          // Se começa com { mas não é array, tenta converter para array
          if (raw.startsWith('{') && !(raw.startsWith('[') && raw.length > 1 && raw[1] === '{')) {
            // Pode ser objeto único ou lista sem colchetes
            // Tenta adicionar colchetes
            raw = '[' + raw + ']';
          }
          
          let parsed = JSON.parse(raw);
          
          // Se não for array, tenta converter
          if (!Array.isArray(parsed)) {
            // Se for objeto único, coloca em array
            if (typeof parsed === 'object' && parsed !== null) {
              parsed = [parsed];
            } else {
              return [];
            }
          }
          
          // Normaliza os objetos para ter decision/tradeoff
          return parsed.map((item: any) => {
            if (typeof item === 'string') {
              return { decision: item, tradeoff: '' };
            }
            if (typeof item === 'object' && item !== null) {
              return {
                decision: item.decision || item.tradeOff || '',
                tradeoff: item.tradeoff || item.impact || ''
              };
            }
            return { decision: '', tradeoff: '' };
          }).filter((item: TradeOff) => item.decision || item.tradeoff) as TradeOff[];
        } catch (error) {
          console.warn('Failed to parse tradeOffs:', error, project.tradeOffs);
          return [];
        }
      })()
    : [];

  return (
    <div className="space-y-12">
      {/* 1. Overview */}
      <section>
        <h2 className="text-2xl font-black mb-4">Overview</h2>
        <div className="metric-card p-6">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </section>

      {/* 2. Business Problem */}
      {project.businessProblem && (
        <section>
          <h2 className="text-2xl font-black mb-4">Business Problem</h2>
          <div className="metric-card p-6">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {project.businessProblem}
            </p>
          </div>
        </section>
      )}

      {/* 3. Technical Solution */}
      {technicalSolutionRaw.length > 0 && (
        <section>
          <h2 className="text-2xl font-black mb-4">Technical Solution</h2>
          <div className="metric-card p-6">
            <ul className="space-y-4">
              {technicalSolutionRaw.map((item, index) => {
                if (typeof item === 'string') {
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-bold mt-1">•</span>
                      <span className="text-slate-600 dark:text-slate-300 flex-1">{item}</span>
                    </li>
                  );
                } else if (item && typeof item === 'object') {
                  const obj = item as TechnicalSolutionItem;
                  const step = obj.step || obj.description || '';
                  const tool = obj.tool || '';
                  
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-bold mt-1">•</span>
                      <div className="flex-1">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step}
                        </p>
                        {tool && (
                          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">
                            Tool: {tool}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                } else {
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-accent font-bold mt-1">•</span>
                      <span className="text-slate-600 dark:text-slate-300 flex-1">{String(item)}</span>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </section>
      )}

      {/* 4. Technical Decisions */}
      {technicalDecisions.length > 0 && (
        <section>
          <h2 className="text-2xl font-black mb-4">Technical Decisions</h2>
          <div className="space-y-4">
            {technicalDecisions.map((decision, index) => (
              <div key={index} className="metric-card p-6">
                {decision.question && (
                  <h3 className="text-lg font-bold text-accent mb-2">
                    {decision.question}
                  </h3>
                )}
                {decision.answer && (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {decision.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Trade-offs */}
      {tradeOffs.length > 0 && (
        <section>
          <h2 className="text-2xl font-black mb-4">Trade-offs</h2>
          <div className="space-y-4">
            {tradeOffs.map((tradeOff, index) => (
              <div key={index} className="metric-card p-6">
                {tradeOff.decision && (
                  <h3 className="text-lg font-bold mb-2">{tradeOff.decision}</h3>
                )}
                {tradeOff.tradeoff && (
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-mono text-xs text-slate-400">Trade-off: </span>
                    {tradeOff.tradeoff}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Architecture Snapshot */}
      {project.architectureNotes && (
        <section>
          <ArchitectureSnapshot architectureNotes={project.architectureNotes} />
        </section>
      )}

      {/* 7. Impact Metrics */}
      {(project.metric1Name || project.metric2Name) && (
        <section>
          <h2 className="text-2xl font-black mb-4">Impact Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.metric1Name && (
              <div className="metric-card p-6">
                <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                  {project.metric1Name}
                </div>
                <div className="text-3xl font-black text-emerald-500">
                  {project.metric1Value}
                </div>
              </div>
            )}
            {project.metric2Name && (
              <div className="metric-card p-6">
                <div className="text-xs font-mono text-slate-400 uppercase mb-2">
                  {project.metric2Name}
                </div>
                <div className="text-3xl font-black">
                  {project.metric2Value}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
