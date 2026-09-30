import { MediaGrid } from '@/components/admin/MediaPicker'

export default function AdminMidia() {
  return (
    <div>
      <h1 className="font-serif text-[clamp(34px,4.5vw,44px)] leading-none">Mídia</h1>
      <p className="text-[13.5px] text-subtle mt-1.5 mb-5">Fotos e vídeos do site. &quot;Copiar link&quot; serve pra colar em qualquer lugar.</p>
      <MediaGrid manage />
    </div>
  )
}
