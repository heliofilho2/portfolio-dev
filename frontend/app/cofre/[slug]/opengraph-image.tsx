import { ImageResponse } from 'next/og'
import { getCofreItem } from '@/lib/content'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const item = await getCofreItem((await params).slug)
  const title = item?.title ?? 'Cofre do Hélio'
  const category = item?.category ?? 'Achado'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F6F3EC',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 1040,
            background: '#FCFAF6',
            border: '3px solid #1E1C19',
            borderRadius: 28,
            boxShadow: '14px 14px 0 #1E1C19',
            padding: '56px 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#4F46C8',
                color: '#F6F3EC',
                fontSize: 26,
              }}
            >
              <span>H</span>
              <span style={{ fontStyle: 'italic' }}>F</span>
            </div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 20,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: '#8A8378',
              }}
            >
              Cofre do Hélio · {category}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? 48 : 60,
              lineHeight: 1.15,
              color: '#1E1C19',
              marginTop: 40,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'monospace',
              fontSize: 22,
              color: '#4F46C8',
              marginTop: 48,
            }}
          >
            helio*filho*.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
