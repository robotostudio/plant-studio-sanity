import {useEffect, useMemo, useState, type CSSProperties} from 'react'
import {set, setIfMissing, unset, useClient, useFormValue, type ObjectInputProps} from 'sanity'

/**
 * SEO input for posts, drawn as an editable search engine result.
 *
 * Search engines cut titles and descriptions by their width on screen, not by their
 * number of characters. This measures the text in the same font and size a desktop
 * results page uses, and cuts it with an ellipsis where the search engine would.
 */

type SeoValue = {seoTitle?: string; seoDescription?: string}

// Approximate desktop results page limits (in pixels).
const TITLE_FONT = '20px Arial, sans-serif'
const TITLE_MAX_WIDTH = 600
const DESCRIPTION_FONT = '14px Arial, sans-serif'
const DESCRIPTION_MAX_WIDTH = 920
const ELLIPSIS = '…'

let canvas: HTMLCanvasElement | null = null
function measure(text: string, font: string): number {
  if (typeof document === 'undefined') return text.length * 8
  canvas = canvas || document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return text.length * 8
  context.font = font
  return context.measureText(text).width
}

/** Cuts text at a word break so that it, plus an ellipsis, fits the width. */
function truncate(text: string, font: string, maxWidth: number) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (measure(clean, font) <= maxWidth) return {shown: clean, hidden: '', cut: false}

  let end = clean.length
  while (end > 0 && measure(clean.slice(0, end).trimEnd() + ' ' + ELLIPSIS, font) > maxWidth) {
    end--
  }
  // Prefer a word break, as search engines do.
  const lastSpace = clean.lastIndexOf(' ', end)
  if (lastSpace > end * 0.6) end = lastSpace
  const shown = clean.slice(0, end).trimEnd()
  return {shown, hidden: clean.slice(end).trim(), cut: true}
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#fff',
    border: '1px solid #dadce0',
    borderRadius: 8,
    padding: '16px 20px',
    fontFamily: 'Arial, sans-serif',
    color: '#202124',
    maxWidth: 652,
  },
  label: {fontSize: 12, color: '#70757a', marginBottom: 12},
  siteRow: {display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4},
  favicon: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#f1f3f4',
    border: '1px solid #dadce0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#5f6368',
    flexShrink: 0,
  },
  siteName: {fontSize: 14, lineHeight: '20px', color: '#202124'},
  url: {fontSize: 12, lineHeight: '18px', color: '#4d5156'},
  title: {
    font: TITLE_FONT,
    lineHeight: '26px',
    color: '#1a0dab',
    cursor: 'text',
    display: 'block',
    width: '100%',
    maxWidth: TITLE_MAX_WIDTH,
    padding: '2px 0',
    margin: '4px 0 2px',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px dashed transparent',
    textAlign: 'left',
  },
  description: {
    font: DESCRIPTION_FONT,
    lineHeight: '22px',
    color: '#4d5156',
    cursor: 'text',
    display: 'block',
    width: '100%',
    maxWidth: TITLE_MAX_WIDTH,
    padding: '2px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px dashed transparent',
    textAlign: 'left',
    whiteSpace: 'normal',
  },
  editing: {
    outline: 'none',
    borderBottom: '1px solid #1a73e8',
    background: '#f8f9fa',
    resize: 'vertical',
  },
  placeholder: {fontStyle: 'italic', opacity: 0.6},
  status: {fontSize: 12, lineHeight: '18px', marginTop: 4},
  hint: {fontSize: 12, color: '#70757a', marginTop: 14},
}

function Status({
  length,
  cut,
  hidden,
  isFallback,
  fallbackLabel,
}: {
  length: number
  cut: boolean
  hidden: string
  isFallback: boolean
  fallbackLabel: string
}) {
  return (
    <div style={{...styles.status, color: cut ? '#b06000' : '#188038'}}>
      {isFallback && <span style={{color: '#70757a'}}>{fallbackLabel} · </span>}
      {length} characters ·{' '}
      {cut ? <>cut off before “{hidden.length > 40 ? hidden.slice(0, 40).trimEnd() + ELLIPSIS : hidden}”</> : 'fits without being cut off'}
    </div>
  )
}

export function SearchResultPreviewInput(props: ObjectInputProps) {
  const {onChange, readOnly} = props
  const value = (props.value || {}) as SeoValue

  const postTitle = (useFormValue(['title']) as string | undefined) || ''
  const excerpt = (useFormValue(['excerpt']) as string | undefined) || ''
  const slug = (useFormValue(['slug', 'current']) as string | undefined) || ''

  const client = useClient({apiVersion: '2025-09-25'})
  const [siteTitle, setSiteTitle] = useState('')
  useEffect(() => {
    let active = true
    client
      .fetch<string | null>(`*[_type == "settings"][0].title`)
      .then((title) => active && setSiteTitle(title || ''))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [client])

  const [editing, setEditing] = useState<'title' | 'description' | null>(null)

  const update = (field: keyof SeoValue, next: string) => {
    onChange(next ? [setIfMissing({}), set(next, [field])] : unset([field]))
  }

  // The site writes the SEO title as is; without one, it shows "Post title | Site title".
  const fallbackTitle = [postTitle, siteTitle].filter(Boolean).join(' | ')
  const titleText = value.seoTitle || fallbackTitle
  const descriptionText = value.seoDescription || excerpt

  const title = useMemo(() => truncate(titleText, TITLE_FONT, TITLE_MAX_WIDTH), [titleText])
  const description = useMemo(
    () => truncate(descriptionText, DESCRIPTION_FONT, DESCRIPTION_MAX_WIDTH),
    [descriptionText],
  )

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const host = origin.replace(/^https?:\/\//, '')
  const breadcrumb = [origin || 'https://example.com', 'posts', slug].filter(Boolean).join(' › ')

  return (
    <div style={styles.card}>
      <div style={styles.label}>
        Search result preview — click the title or description to edit it
      </div>

      <div style={styles.siteRow}>
        <div style={styles.favicon} aria-hidden>
          {(siteTitle || host || '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={styles.siteName}>{siteTitle || host}</div>
          <div style={styles.url}>{breadcrumb}</div>
        </div>
      </div>

      {editing === 'title' && !readOnly ? (
        <input
          autoFocus
          aria-label="SEO title"
          style={{...styles.title, ...styles.editing}}
          value={value.seoTitle || ''}
          placeholder={fallbackTitle || 'SEO title'}
          onChange={(event) => update('seoTitle', event.currentTarget.value)}
          onBlur={() => setEditing(null)}
          onKeyDown={(event) => event.key === 'Enter' && setEditing(null)}
        />
      ) : (
        <button
          type="button"
          aria-label="Edit SEO title"
          style={{...styles.title, ...(value.seoTitle ? null : styles.placeholder)}}
          onClick={() => setEditing('title')}
          disabled={readOnly}
        >
          {title.shown || 'Add an SEO title'}
          {title.cut && ` ${ELLIPSIS}`}
        </button>
      )}
      <Status
        length={titleText.length}
        cut={title.cut}
        hidden={title.hidden}
        isFallback={!value.seoTitle}
        fallbackLabel="Using the post title"
      />

      <div style={{height: 10}} />

      {editing === 'description' && !readOnly ? (
        <textarea
          autoFocus
          aria-label="SEO description"
          rows={3}
          style={{...styles.description, ...styles.editing}}
          value={value.seoDescription || ''}
          placeholder={excerpt || 'SEO description'}
          onChange={(event) => update('seoDescription', event.currentTarget.value)}
          onBlur={() => setEditing(null)}
        />
      ) : (
        <button
          type="button"
          aria-label="Edit SEO description"
          style={{...styles.description, ...(value.seoDescription ? null : styles.placeholder)}}
          onClick={() => setEditing('description')}
          disabled={readOnly}
        >
          {description.shown || 'Add an SEO description'}
          {description.cut && ` ${ELLIPSIS}`}
        </button>
      )}
      <Status
        length={descriptionText.length}
        cut={description.cut}
        hidden={description.hidden}
        isFallback={!value.seoDescription && !!excerpt}
        fallbackLabel="Using the excerpt"
      />

      <div style={styles.hint}>
        Where the text is cut off is an estimate for a desktop results page; search engines may
        also choose different wording.
      </div>
    </div>
  )
}
