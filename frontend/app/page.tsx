import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import Products from '@/components/home/Products'
import Channels from '@/components/home/Channels'
import Projects from '@/components/home/Projects'
import Experience from '@/components/home/Experience'
import Stack from '@/components/home/Stack'
import AboutMe from '@/components/home/AboutMe'
import { experiencesApi, profileApi, projectsApi, skillsApi } from '@/lib/api'

export const revalidate = 300

export default async function Home() {
  // Se a API estiver fora, as seções dinâmicas somem e o hub estático continua no ar
  const [projects, experiences, skills, profile] = await Promise.all([
    projectsApi.getAll(),
    experiencesApi.getAll(),
    skillsApi.getAll(),
    profileApi.get(),
  ])

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <Hero />
        <Stats />
        <Products />
        <Channels />
        <Projects projects={projects ?? []} />
        <Experience experiences={experiences ?? []} />
        <Stack skills={skills ?? []} />
        <AboutMe aboutText={profile?.aboutText} />
      </main>
      <Footer />
    </>
  )
}
