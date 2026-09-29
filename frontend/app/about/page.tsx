import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { profileApi } from '@/lib/api'
import { intro } from '@/lib/hub'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Sobre | Helio Filho',
  description: 'Trajetória, especialidades e formação de Helio Filho, desenvolvedor .NET e SAP Business One.',
}

export default async function AboutPage() {
  const profile = await profileApi.get()

  const facts = [
    ['Experiência', profile?.experienceYears],
    ['Stack principal', profile?.coreEngine],
    ['Banco de dados', profile?.database],
    ['Especialidade', profile?.specialized],
    ['Formação', profile?.certifications],
    ['Idiomas', profile?.languages],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <Image
            src="/avatar-abt.jpeg"
            alt={profile?.name ?? intro.name}
            width={128}
            height={128}
            priority
            className="w-32 h-32 rounded-2xl object-cover shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Sobre mim</h1>
            <p className="text-stone-500 dark:text-stone-400">
              {profile?.role ?? intro.headline}
              {profile?.location && ` · ${profile.location}`}
            </p>
          </div>
        </div>

        {profile?.aboutText && (
          <div className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line mb-12">
            {profile.aboutText}
          </div>
        )}

        {profile?.description && (
          <section className="mb-12">
            <h2 className="section-title">Resumo profissional</h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{profile.description}</p>
          </section>
        )}

        {facts.length > 0 && (
          <section>
            <h2 className="section-title">Em resumo</h2>
            <dl className="card divide-y divide-line">
              {facts.map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 px-5 py-3.5">
                  <dt className="text-sm text-stone-500 dark:text-stone-400">{label}</dt>
                  <dd className="text-sm font-medium sm:text-right sm:max-w-[65%]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {!profile && <p className="text-stone-500 dark:text-stone-400">{intro.bio}</p>}
      </main>
      <Footer />
    </>
  )
}
