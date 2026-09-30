// Contadores de seguidores: sem API própria ainda, atualizar à mão.
export const socials = [
  { name: 'Instagram', count: '84k', handle: '@heliofilhou', tone: 'peach' as const, url: 'https://www.instagram.com/heliofilhou/' },
  { name: 'TikTok', count: '150k', handle: '@heliofilhou', tone: 'lilac' as const, url: 'https://www.tiktok.com/@heliofilhou' },
  { name: 'LinkedIn', count: '', handle: 'in/heliofilhoo', tone: 'sky' as const, url: 'https://www.linkedin.com/in/heliofilhoo/' },
  { name: 'GitHub', count: '', handle: 'heliofilho2', tone: 'mint' as const, url: 'https://github.com/heliofilho2' },
  { name: 'YouTube', count: 'em breve', handle: '@heliofilhou', tone: 'rose' as const, url: 'https://www.youtube.com/@heliofilhou' },
]

export const toneClass: Record<string, string> = {
  lilac: 'bg-lilac',
  mint: 'bg-mint',
  peach: 'bg-peach',
  butter: 'bg-butter',
  sky: 'bg-sky',
  rose: 'bg-rose',
}

export const contactEmail = 'heliofilho.contato@outlook.com'
