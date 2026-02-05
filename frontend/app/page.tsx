/**
 * Página Principal
 * 
 * POR QUÊ Server Component (sem 'use client')?
 * - Pode buscar dados do servidor (SSR)
 * - Melhor performance inicial
 * - SEO melhor
 * 
 * FUTURO: Buscar dados da API aqui e passar para componentes
 */

import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-20 px-6 max-w-[1600px] mx-auto">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </>
  )
}
