import Image from 'next/image'
import Link from 'next/link'

// Padrão das referências (yudiganeko.com, nels-ysng-guides): um "sobre mim" pessoal com foto perto do fim
export default function AboutMe({ aboutText }: { aboutText?: string }) {
  const paragraphs = aboutText?.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean) ?? []
  if (paragraphs.length === 0) return null

  return (
    <section id="sobre" className="mb-16 scroll-mt-20">
      <h2 className="section-title">Sobre mim</h2>
      <div className="grid sm:grid-cols-[180px_1fr] gap-6 items-start">
        <Image
          src="/avatar-abt.jpeg"
          alt="Helio Filho"
          width={180}
          height={220}
          className="w-full max-w-[180px] aspect-[9/11] rounded-2xl object-cover"
        />
        <div className="space-y-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          {paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <Link href="/about" className="inline-block text-sm font-medium text-accent hover:underline underline-offset-4">
            Minha trajetória completa
          </Link>
        </div>
      </div>
    </section>
  )
}
