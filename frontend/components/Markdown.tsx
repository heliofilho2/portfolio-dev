import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MediaBlock from './MediaBlock'

// Renderiza o texto do blog, cofre e projetos. Estilos em globals.css (.md).
// Mídia usa a sintaxe de imagem ![legenda](url): foto vira <img>, arquivo de vídeo vira player,
// link do YouTube/Instagram vira o player deles. HTML cru no texto é ignorado.

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
          // Parágrafo que só tem mídia vira bloco (figure não pode ficar dentro de <p>).
          p: ({ node, children }) => {
            const only = node?.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
            if (only?.length && only.every((c) => c.type === 'element' && c.tagName === 'img')) return <>{children}</>
            return <p>{children}</p>
          },
          img: ({ src, alt }) => (typeof src === 'string' && src ? <MediaBlock src={src} alt={alt ?? ''} /> : null),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
