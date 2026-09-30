import { permanentRedirect } from 'next/navigation'

// Rota do protótipo (/cofre/videos/x). Todo item do cofre agora vive em /cofre/x, link mais curto pra DM.
export default async function LegacyVideoRoute({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(`/cofre/${(await params).slug}`)
}
