import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

// Imagem que veio do /admin. Arquivo do site ou do Supabase Storage passa pelo otimizador
// do Next (tamanho certo pro celular); link de outro site vira <img> comum.
const optimizable = (src: string) => (src.startsWith('/') && !src.startsWith('/api/')) || /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src)

export default function MediaImg({ src, alt, width, height, fill, sizes, priority, className = '' }: Props) {
  if (optimizable(src)) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes={sizes ?? '100vw'} priority={priority} className={className} />
    ) : (
      <Image src={src} alt={alt} width={width ?? 800} height={height ?? 800} sizes={sizes} priority={priority} className={className} />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}
    />
  )
}
