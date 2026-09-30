import type { Tone } from './contentModel'

// Textos, fotos e listas da home e do Sobre, editáveis em /admin/site.
// Guardado como um JSON só (site_settings, id 'main'); o que não foi salvo usa estes padrões.

export interface Social {
  name: string
  handle: string
  url: string
  count: string
  tone: Tone
}

export interface Reel {
  title: string
  url: string
  views: string
  image_url: string
  tone: Tone
}

export interface NowCard {
  label: string
  text: string
}

export interface TimelineItem {
  when: string
  role: string
  desc: string
}

export interface SiteSettings {
  avatar_url: string
  hand_note: string
  bio: string
  contact_email: string
  socials: Social[]
  reels: Reel[]
  about_photo_url: string
  about_location: string
  about_text: string
  about_now: NowCard[]
  about_timeline: TimelineItem[]
  about_stack: string[]
}

export const defaultSettings: SiteSettings = {
  avatar_url: '/helio.jpg',
  hand_note: 'oi! eu sou o',
  bio: 'Dev full-stack que cria conteúdo sobre tecnologia, IA e carreira. Projetos, materiais e um jornal tech: tudo mora aqui.',
  contact_email: 'heliofilho.contato@outlook.com',
  socials: [
    { name: 'Instagram', count: '84k', handle: '@heliofilhou', tone: 'peach', url: 'https://www.instagram.com/heliofilhou/' },
    { name: 'TikTok', count: '150k', handle: '@heliofilhou', tone: 'lilac', url: 'https://www.tiktok.com/@heliofilhou' },
    { name: 'LinkedIn', count: '', handle: 'in/heliofilhoo', tone: 'sky', url: 'https://www.linkedin.com/in/heliofilhoo/' },
    { name: 'GitHub', count: '', handle: 'heliofilho2', tone: 'mint', url: 'https://github.com/heliofilho2' },
    { name: 'YouTube', count: 'em breve', handle: '@heliofilhou', tone: 'rose', url: 'https://www.youtube.com/@heliofilhou' },
  ],
  reels: [
    { title: 'O robô que lê 10 sites de IA por mim', views: '84k', tone: 'lilac', url: 'https://www.instagram.com/heliofilhou/', image_url: '' },
    { title: '3 prompts que eu uso todo dia no código', views: '52k', tone: 'butter', url: 'https://www.instagram.com/heliofilhou/', image_url: '' },
    { title: 'Automatizei minhas DMs com C#', views: '41k', tone: 'peach', url: 'https://www.instagram.com/heliofilhou/', image_url: '' },
    { title: 'Clean Architecture em 60 segundos', views: '33k', tone: 'mint', url: 'https://www.instagram.com/heliofilhou/', image_url: '' },
  ],
  about_photo_url: '/helio.jpg',
  about_location: 'Itajubá, MG',
  about_text:
    'Sou dev há mais de 5 anos e, nas horas vagas, construo meus próprios apps com IA. No Instagram eu falo de tecnologia, IA e dinheiro, e aqui eu guardo tudo: projetos, materiais e um jornal tech.',
  about_now: [
    { label: 'Construindo', text: 'O Jornal Tech e este site' },
    { label: 'Postando', text: 'Tecnologia, IA e dinheiro no Instagram' },
    { label: 'Trabalhando', text: '.NET para SAP Business One' },
  ],
  about_timeline: [
    { when: 'desde 2026', role: 'Desenvolvedor .NET · RAMO BH', desc: 'Desenvolvimento .NET para SAP Business One.' },
    { when: '2025 a 2026', role: 'Desenvolvedor SAP Business One · SAASAgro', desc: 'Desenvolvimento e integrações com o SAP Business One.' },
    { when: '2021 a 2025', role: 'Analista de Sistemas SAP Business One · PrimeInterway', desc: 'Análise e desenvolvimento no SAP Business One.' },
    { when: '2021', role: 'Estágio em Integração de Dados · Prefeitura de Itajubá', desc: 'O primeiro emprego na área.' },
  ],
  about_stack: ['C#', '.NET', 'SAP Business One', 'TypeScript', 'Next.js', 'Supabase', 'Claude Code'],
}

export const mergeSettings = (stored: Partial<SiteSettings> | null | undefined): SiteSettings => ({ ...defaultSettings, ...(stored ?? {}) })
