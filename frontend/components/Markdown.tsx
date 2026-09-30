import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Renderiza o markdown do cofre e dos projetos. Estilos em globals.css (.md).
// Links externos abrem em nova aba; HTML cru no markdown é ignorado (padrão do react-markdown).
export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`md ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith('http')
            return (
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
