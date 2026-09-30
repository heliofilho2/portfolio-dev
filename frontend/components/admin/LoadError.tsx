import { Notice } from './ui'

export default function LoadError({ error }: { error: string }) {
  return (
    <Notice tone="rose">
      <strong>Não deu pra carregar o conteúdo.</strong> {error}
    </Notice>
  )
}
