/**
 * Shared layout for generated Open Graph images (next/og ImageResponse).
 * Kept to inline styles because Satori renders a subset of CSS, not Tailwind.
 */
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

export const ogSize = {width: 1200, height: 630}

/** Inter 400 + 700 (latin subset, OFL) for Satori, which cannot use next/font. */
export async function ogFonts() {
  const dir = join(process.cwd(), 'app/fonts')
  const [regular, bold] = await Promise.all([
    readFile(join(dir, 'inter-latin-400-normal.woff')),
    readFile(join(dir, 'inter-latin-700-normal.woff')),
  ])
  return [
    {name: 'Inter', data: regular, style: 'normal' as const, weight: 400 as const},
    {name: 'Inter', data: bold, style: 'normal' as const, weight: 700 as const},
  ]
}

/** Satori ignores line-clamp, so cut long text here. */
export function clamp(text: string | null | undefined, max: number) {
  if (!text) return null
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  return trimmed.slice(0, max).replace(/\s+\S*$/, '') + '\u2026'
}

type Props = {
  eyebrow?: string
  title: string
  description?: string | null
  footer?: string | null
  /** Shown as a cropped panel on the right, 540x630. */
  image?: string | null
}

export function OgCard({eyebrow, title, description, footer, image}: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        background: '#ffffff',
        color: '#0b0b0b',
        fontFamily: 'Inter',
      }}
    >
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#f50'}} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 20,
          padding: '0 56px 64px 72px',
          width: image ? 660 : 1200,
        }}
      >
        {eyebrow && (
          <div style={{fontSize: 24, letterSpacing: 2, textTransform: 'uppercase', color: '#727892'}}>
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: image ? (title.length > 40 ? 52 : 64) : title.length > 60 ? 56 : 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{fontSize: 30, lineHeight: 1.35, color: '#515870', maxWidth: 960}}>{description}</div>
        )}
        {footer && <div style={{fontSize: 24, color: '#727892', marginTop: 8}}>{footer}</div>}
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          width={540}
          height={630}
          style={{width: 540, height: 630, objectFit: 'cover', borderLeft: '1px solid #e3e4e8'}}
        />
      )}
    </div>
  )
}
