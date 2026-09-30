import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { devMediaDir, devStoreOn } from '@/lib/devStore'

const types: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/mp4',
  '.pdf': 'application/pdf',
}

// Serve a mídia enviada pelo /admin no modo local. Em produção a mídia vem do Supabase Storage.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!devStoreOn) return new Response('Not found', { status: 404 })
  const name = path.basename(decodeURIComponent((await params).name))
  try {
    const bytes = await readFile(path.join(devMediaDir, name))
    return new Response(new Uint8Array(bytes), {
      headers: { 'Content-Type': types[path.extname(name).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'public, max-age=3600' },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
