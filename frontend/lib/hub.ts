// Conteúdo estático do hub — edite aqui, sem depender da API.
// Itens sem `url` aparecem como "Em breve" e não viram link.

export type ProductStatus = 'live' | 'building'
export type SocialIcon = 'tiktok' | 'instagram' | 'youtube' | 'linkedin' | 'github'
export type ChannelIcon = 'newsletter' | 'vault' | 'video' | 'news'

export interface Product {
  name: string
  tagline: string
  highlight?: string
  url?: string
  status: ProductStatus
}

export interface Channel {
  name: string
  description: string
  icon: ChannelIcon
  url?: string
  label: string
}

export interface Social {
  name: string
  icon: SocialIcon
  handle: string
  url: string
  followers?: string
}

export const intro = {
  name: 'Helio Filho',
  headline: 'Desenvolvedor .NET especializado em SAP Business One.',
  bio: 'Construo integrações e automações para ERP no dia a dia, crio produtos SaaS nas horas vagas e falo sobre tecnologia e IA para mais de 230 mil pessoas.',
  location: 'Itajubá, MG',
  email: 'heliofilho.contato@outlook.com',
  whatsapp: 'https://wa.me/5535984727320',
  newsletterUrl: 'https://heliofilhou.substack.com/',
}

// Para mostrar os botões de currículo, coloque os PDFs em public/cv/ e adicione aqui, ex:
// { label: 'Currículo (PT)', href: '/cv/helio-filho-cv-pt.pdf' }
export const resumes: { label: string; href: string }[] = []

export const stats = [
  { value: '150k+', label: 'seguidores no TikTok' },
  { value: '84k+', label: 'seguidores no Instagram' },
  { value: '80', label: 'usuários no Planilio' },
  { value: '+5 anos', label: 'com .NET e SAP B1' },
]

export const products: Product[] = [
  {
    name: 'Planilio',
    tagline:
      'Organização e projeção financeira de 24 meses, simulador de gastos e importação de fatura de cartão em PDF.',
    highlight: '80 usuários',
    url: 'https://planilio.com.br',
    status: 'live',
  },
]

export const channels: Channel[] = [
  {
    name: 'Newsletter',
    description: 'Edições sobre tecnologia, IA e bastidores dos projetos.',
    icon: 'newsletter',
    url: 'https://heliofilhou.substack.com/',
    label: 'Assinar',
  },
  {
    name: 'Cofre do Hélio',
    description: 'Guias, templates e materiais de cada vídeo, reunidos no Notion.',
    icon: 'vault',
    url: 'https://coconut-carpenter-6eb.notion.site/Cofre-do-H-lio-02985ad304a046ad912b6940fb77104a',
    label: 'Abrir cofre',
  },
  {
    name: 'Vídeos',
    description: 'Vídeos novos sobre tecnologia, IA e carreira no YouTube.',
    icon: 'video',
    url: 'https://www.youtube.com/@heliofilhou',
    label: 'Assistir',
  },
  {
    name: 'Jornal Tech/IA',
    description: 'Notícias diárias de IA e tecnologia, curadas e resumidas.',
    icon: 'news',
    label: 'jornal.heliofilho.dev',
  },
]

export const socials: Social[] = [
  { name: 'TikTok', icon: 'tiktok', handle: '@heliofilhou', url: 'https://www.tiktok.com/@heliofilhou', followers: '150k+' },
  { name: 'Instagram', icon: 'instagram', handle: '@heliofilhou', url: 'https://www.instagram.com/heliofilhou/', followers: '84k+' },
  { name: 'YouTube', icon: 'youtube', handle: '@heliofilhou', url: 'https://www.youtube.com/@heliofilhou' },
  { name: 'LinkedIn', icon: 'linkedin', handle: 'heliofilhoo', url: 'https://www.linkedin.com/in/heliofilhoo/' },
  { name: 'GitHub', icon: 'github', handle: 'heliofilho2', url: 'https://github.com/heliofilho2' },
]
