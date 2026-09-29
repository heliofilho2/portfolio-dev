const FEED_URL = 'https://heliofilhou.substack.com/feed'

export interface NewsletterPost {
  title: string
  url: string
  date: string
  excerpt: string
}

const tag = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))
  return match?.[1].trim() ?? ''
}

// Última edição da newsletter (Substack expõe RSS); falha silenciosa: a coluna some
export async function getLatestPost(): Promise<NewsletterPost | null> {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 } })
    if (!response.ok) return null
    const item = (await response.text()).match(/<item>([\s\S]*?)<\/item>/)?.[1]
    if (!item) return null

    return {
      title: tag(item, 'title'),
      url: tag(item, 'link'),
      date: tag(item, 'pubDate'),
      excerpt: tag(item, 'description').replace(/<[^>]+>/g, '').slice(0, 220),
    }
  } catch {
    return null
  }
}
