'use client'

// Abre a janela de impressão do navegador: em "Salvar como PDF" sai o mídia kit com os números
// do dia, sem precisar refazer o arquivo à mão. O cabeçalho, o rodapé e os botões somem na
// impressão (print:hidden), e o reveal-on-scroll é desligado em globals.css.
export default function PrintButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      Salvar em PDF
    </button>
  )
}
