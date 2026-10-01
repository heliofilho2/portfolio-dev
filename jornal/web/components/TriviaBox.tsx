'use client'

import { useEffect, useState } from 'react'

// Pergunta do dia: embaralha as alternativas só depois de montar (useEffect, não durante o
// render - Math.random ali violaria a regra de pureza do React e, pior, daria hydration
// mismatch entre servidor e cliente). Até lá mostra a ordem fixa (certa por último), que é o
// que o servidor também renderiza. Sem ranking por enquanto - isso precisa de alguma forma de
// identificar a mesma pessoa entre visitas sem exigir login, e ainda não foi desenhado.
export default function TriviaBox({ question, correct, wrong }: { question: string; correct: string; wrong: string[] }) {
  const [picked, setPicked] = useState<string | null>(null)
  const [options, setOptions] = useState([...wrong, correct])

  useEffect(() => {
    // Sorteio único pós-montagem, não sincronização externa - exceção justificada à regra.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptions([...wrong, correct].sort(() => Math.random() - 0.5))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <p className="mb-2.5">{question}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const isCorrect = opt === correct
          const isPicked = opt === picked
          const show = picked !== null
          return (
            <button
              key={opt}
              type="button"
              disabled={show}
              onClick={() => setPicked(opt)}
              className={`text-left px-3 py-1.5 rounded-lg border font-mono text-[12.5px] tracking-[0.02em] transition-colors cursor-pointer disabled:cursor-default ${
                show && isCorrect
                  ? 'border-[#2F6B3F] bg-[#2F6B3F]/10 text-[#2F6B3F]'
                  : show && isPicked
                    ? 'border-[#C4584C] bg-[#C4584C]/10 text-[#C4584C]'
                    : 'border-box bg-paper hover:border-ink'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {picked && <p className="text-[12px] italic mt-2">{picked === correct ? 'Acertou!' : 'Não foi dessa vez.'} Volta amanhã pra próxima.</p>}
    </div>
  )
}
