import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

import {NextMark, SanityMark} from '@/app/components/BrandMarks'

/**
 * Generated Open Graph card that mirrors the hero: halftone dots, italic mono eyebrow pill,
 * big title with the orange and black underlines, and the two round marks.
 * Inline styles only: Satori renders a CSS subset and cannot use Tailwind or next/font.
 */
export const ogSize = {width: 1200, height: 630}

const fontsDir = join(process.cwd(), 'app/fonts')

export async function ogAssets() {
  const [inter, interBold, mono, monoItalic, tile] = await Promise.all([
    readFile(join(fontsDir, 'inter-latin-400-normal.woff')),
    readFile(join(fontsDir, 'inter-latin-700-normal.woff')),
    readFile(join(fontsDir, 'ibm-plex-mono-latin-400-normal.woff')),
    readFile(join(fontsDir, 'ibm-plex-mono-latin-400-italic.woff')),
    readFile(join(process.cwd(), 'public/images/tile-1-black.png')),
  ])
  return {
    fonts: [
      {name: 'Inter', data: inter, style: 'normal' as const, weight: 400 as const},
      {name: 'Inter', data: interBold, style: 'normal' as const, weight: 700 as const},
      {name: 'IBM Plex Mono', data: mono, style: 'normal' as const, weight: 400 as const},
      {name: 'IBM Plex Mono', data: monoItalic, style: 'italic' as const, weight: 400 as const},
    ],
    tile: `data:image/png;base64,${tile.toString('base64')}`,
  }
}

/** Satori ignores line-clamp, so cut long text here. */
export function clamp(text: string | null | undefined, max: number) {
  if (!text) return null
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return trimmed.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

type Props = {
  tile: string
  eyebrow?: string | null
  title: string
  /** Mono line under the title, for example "Amara Okafor · June 3, 2025". */
  meta?: string | null
  /** Smaller type for long post titles. */
  compact?: boolean
}

export function OgCard({tile, eyebrow, title, meta, compact = false}: Props) {
  // "Sanity + Next.js" gets the hero's two-tone underline; anything else one orange underline.
  const parts = title.split(/\s\+\s/)
  const fontSize = compact ? (title.length > 50 ? 60 : 72) : title.length > 18 ? 88 : 128
  const underline = compact ? 8 : 12

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#ffffff',
        backgroundImage: `url(${tile})`,
        backgroundSize: '5px 5px',
        backgroundRepeat: 'repeat',
        color: '#0b0b0b',
        fontFamily: 'Inter',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.9) 100%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: compact ? 28 : 36,
          padding: '0 80px',
          position: 'relative',
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontFamily: 'IBM Plex Mono',
              fontStyle: 'italic',
              fontSize: 26,
              letterSpacing: 2,
              textTransform: 'uppercase',
              background: '#ffffff',
              padding: '6px 16px',
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: compact ? 0 : 18,
            maxWidth: compact ? 880 : 1040,
            fontSize,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -4,
            textAlign: 'center',
          }}
        >
          {parts.map((part, index) => (
            <span key={index} style={{display: 'flex', alignItems: 'flex-end'}}>
              <span
                style={{
                  display: 'flex',
                  paddingBottom: 10,
                  borderBottom: `${underline}px solid ${index % 2 === 0 ? '#f50' : '#0b0b0b'}`,
                }}
              >
                {part}
              </span>
              {index < parts.length - 1 && <span style={{paddingBottom: 10}}>+</span>}
            </span>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', marginTop: compact ? 4 : 8}}>
          <div
            style={{
              display: 'flex',
              borderRadius: 9999,
              border: '4px solid #ffffff',
              background: '#ffffff',
              marginRight: -20,
            }}
          >
            <SanityMark size={compact ? 96 : 128} />
          </div>
          <div style={{display: 'flex', borderRadius: 9999, border: '4px solid #ffffff'}}>
            <NextMark size={compact ? 96 : 128} />
          </div>
        </div>
        {meta && (
          <div style={{fontFamily: 'IBM Plex Mono', fontSize: 24, color: '#515870'}}>{meta}</div>
        )}
      </div>
    </div>
  )
}
