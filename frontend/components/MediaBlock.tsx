// Foto, vídeo enviado ou player do YouTube/Instagram, a partir de uma URL.
// Usado no texto em markdown e no bloco de vídeo das páginas do cofre.

export function embedOf(url: string): { src: string; vertical: boolean } | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, vertical: url.includes('/shorts/') }
  const ig = url.match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/)
  if (ig) return { src: `https://www.instagram.com/reel/${ig[1]}/embed`, vertical: true }
  return null
}

export default function MediaBlock({ src, alt }: { src: string; alt: string }) {
  const caption = alt && alt !== 'vídeo' ? alt : ''
  const embed = embedOf(src)
  let media
  if (embed) {
    media = (
      <iframe
        src={embed.src}
        title={caption || 'Vídeo'}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={`w-full rounded-2xl border border-line bg-chip ${embed.vertical ? 'aspect-[9/16] max-w-[360px] mx-auto block' : 'aspect-video'}`}
      />
    )
  } else if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(src)) {
    media = <video src={src} controls playsInline preload="metadata" className="w-full rounded-2xl bg-ink" />
  } else {
    // eslint-disable-next-line @next/next/no-img-element
    media = <img src={src} alt={caption} loading="lazy" className="w-full h-auto rounded-2xl border border-line" />
  }
  return (
    <figure className="md-media">
      {media}
      {caption && <figcaption className="text-[13px] text-subtle text-center mt-2">{caption}</figcaption>}
    </figure>
  )
}
