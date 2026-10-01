// Widget oficial de assinatura do Substack (gerado em Configurações > Crescimento no painel do
// Substack). O form caseiro antigo postava direto pro endpoint não-oficial da API e o Substack
// rejeitava a origem (heliofilho.dev não está nos domínios autorizados pra aquele truque),
// então todo clique "funcionava" na tela mas não inscrevia ninguém de verdade. O iframe é mais
// lento pra carregar e tem a cara padrão do Substack (sem dar pra re-estilizar o conteúdo, já que
// é cross-origin), mas garante que a inscrição realmente acontece.
interface NewsletterFormProps {
  variant?: 'pill' | 'block'
  ctaLabel?: string
}

export default function NewsletterForm({ variant = 'pill' }: NewsletterFormProps) {
  return (
    <div
      className={
        variant === 'pill'
          ? 'rounded-3xl overflow-hidden bg-surface'
          : 'rounded-3xl overflow-hidden bg-surface border border-line shadow-[0_20px_40px_-28px_rgba(30,28,25,.4)]'
      }
    >
      <iframe
        src="https://heliofilhou.substack.com/embed"
        title="Assinar a newsletter"
        style={{ border: 'none', background: 'white', width: '100%', height: 320 }}
        scrolling="no"
      />
    </div>
  )
}
