/**
 * Post editor with an editable search result preview for the SEO fields.
 *
 * The post's `seoTitle` and `seoDescription` fields are edited inside a card that looks like a
 * search engine result, so editors see where the title and description get cut off.
 */
import {useEffect, useMemo, useRef, useState, type CSSProperties} from 'react'
import {
  PatchEvent,
  set,
  unset,
  useClient,
  useFormValue,
  type ObjectInputProps,
  type ObjectMember,
} from 'sanity'

import {apiVersion} from '../lib/api'
import {title as demoTitle} from '../lib/demo'

const SEO_FIELDS = ['seoTitle', 'seoDescription']

// Search results cut titles at about 600px wide and descriptions after two lines of the same width.
const RESULT_WIDTH = 600
const TITLE_FONT = '20px Arial, sans-serif'
const DESCRIPTION_FONT = '14px Arial, sans-serif'
const DESCRIPTION_MAX_WIDTH = RESULT_WIDTH * 2 - 140


function Stack(props: {space: number; children: React.ReactNode}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: props.space * 4}}>
      {props.children}
    </div>
  )
}

function Text(props: {children: React.ReactNode; muted?: boolean; strong?: boolean; color?: string}) {
  return (
    <div
      style={{
        fontSize: 13,
        lineHeight: '19px',
        fontWeight: props.strong ? 600 : 400,
        opacity: props.muted ? 0.7 : 1,
        color: props.color,
      }}
    >
      {props.children}
    </div>
  )
}

let canvas: HTMLCanvasElement | null = null
function textWidth(text: string, font: string): number {
  if (typeof document === 'undefined') return text.length * 8
  canvas ??= document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return text.length * 8
  context.font = font
  return context.measureText(text).width
}

type SiteInfo = {title?: string; url?: string}

function useSiteInfo(): SiteInfo {
  const client = useClient({apiVersion})
  const [info, setInfo] = useState<SiteInfo>({})
  useEffect(() => {
    let active = true
    client
      .fetch<SiteInfo | null>(
        `*[_id == "siteSettings"][0]{title, "url": ogImage.metadataBase}`,
        {},
        {perspective: 'published'},
      )
      .then((result) => active && setInfo(result ?? {}))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [client])
  return info
}

function siteUrl(url?: string): URL | undefined {
  try {
    return new URL(url || window.location.origin)
  } catch {
    return undefined
  }
}

const editableBase: CSSProperties = {
  display: 'block',
  width: '100%',
  border: '1px dashed transparent',
  borderRadius: 4,
  padding: '2px 4px',
  margin: '-3px -5px',
  background: 'transparent',
  fontFamily: 'Arial, sans-serif',
  cursor: 'text',
  textAlign: 'left',
  boxSizing: 'content-box',
}

function EditableLine(props: {
  value: string
  fallback: string
  placeholder: string
  onChange: (next: string) => void
  multiline?: boolean
  style: CSSProperties
  previewStyle: CSSProperties
  label: string
}) {
  const {value, fallback, placeholder, onChange, multiline, style, previewStyle, label} = props
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const shown = value || fallback || placeholder
  const isFallback = !value

  if (editing) {
    const shared = {
      ref: inputRef,
      value,
      placeholder: fallback || placeholder,
      'aria-label': label,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange(event.target.value),
      onBlur: () => setEditing(false),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' || (event.key === 'Enter' && !multiline)) {
          event.preventDefault()
          setEditing(false)
        }
      },
      style: {
        ...editableBase,
        ...style,
        borderColor: '#8ab4f8',
        background: '#fff',
        outline: 'none',
        resize: 'none' as const,
      },
    }
    return multiline ? <textarea rows={3} {...shared} /> : <input type="text" {...shared} />
  }

  return (
    <button
      type="button"
      aria-label={`Edit ${label}`}
      title="Click to edit"
      onClick={() => setEditing(true)}
      onFocus={() => setEditing(true)}
      style={{...editableBase, ...style}}
      onMouseEnter={(event) => (event.currentTarget.style.borderColor = '#dadce0')}
      onMouseLeave={(event) => (event.currentTarget.style.borderColor = 'transparent')}
    >
      <span style={{...previewStyle, opacity: isFallback ? 0.6 : 1}}>{shown}</span>
    </button>
  )
}

function LengthNote(props: {label: string; text: string; width: number; max: number; custom: boolean}) {
  const {label, text, width, max, custom} = props
  const tooLong = width > max
  const status = !text
    ? 'empty'
    : tooLong
      ? 'too long: it will be cut off with "…"'
      : 'fits'
  return (
    <Text muted={!tooLong} color={tooLong ? '#b06000' : undefined}>
      {label}: {text.length} characters, {status}
      {!custom && text ? ' (using the fallback)' : ''}
    </Text>
  )
}

function useSerpValues() {
  const seoTitle = (useFormValue(['seoTitle']) as string | undefined) ?? ''
  const seoDescription = (useFormValue(['seoDescription']) as string | undefined) ?? ''
  const postTitle = (useFormValue(['title']) as string | undefined) ?? ''
  const excerpt = (useFormValue(['excerpt']) as string | undefined) ?? ''
  const slug = (useFormValue(['slug', 'current']) as string | undefined) ?? ''
  const site = useSiteInfo()
  return {seoTitle, seoDescription, postTitle, excerpt, slug, site}
}

export function PostInputWithSerp(props: ObjectInputProps) {
  const {members, onChange} = props
  const {seoTitle, seoDescription, postTitle, excerpt, slug, site} = useSerpValues()

  const otherMembers = useMemo(
    () =>
      members.filter(
        (member: ObjectMember) => !(member.kind === 'field' && SEO_FIELDS.includes(member.name)),
      ),
    [members],
  )

  const siteTitle = site.title || demoTitle
  // Matches the site's page titles: a custom SEO title is used as is,
  // otherwise the post title gets the site name after it.
  const titleFallback = postTitle ? `${postTitle} | ${siteTitle}` : ''
  const shownTitle = seoTitle || titleFallback
  const shownDescription = seoDescription || excerpt

  const url = siteUrl(site.url)
  const host = url?.host || 'your-site.com'
  const crumbs = ['posts', slug].filter(Boolean)

  const update = (field: string) => (next: string) =>
    onChange(PatchEvent.from(next ? set(next, [field]) : unset([field])))

  return (
    <Stack space={5}>
      {props.renderDefault({...props, members: otherMembers})}

      <Stack space={3}>
        <Stack space={2}>
          <Text strong>
            Search result
          </Text>
          <Text muted>
            How this post may look on a search engine results page. Click the title or description
            to edit them. Left empty, the post title and excerpt are used.
          </Text>
        </Stack>

        <div
          style={{
            padding: 16,
            borderRadius: 6,
            border: '1px solid #dadce0',
            background: '#fff',
            color: '#202124',
            overflow: 'hidden',
          }}
        >
          <div style={{maxWidth: RESULT_WIDTH, fontFamily: 'Arial, sans-serif'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6}}>
              <div
                aria-hidden
                style={{
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
                }}
              >
                {siteTitle.charAt(0).toUpperCase()}
              </div>
              <div style={{lineHeight: '18px', minWidth: 0}}>
                <div style={{fontSize: 14, color: '#202124'}}>{siteTitle}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#4d5156',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {[`https://${host}`, ...crumbs].join(' › ')}
                </div>
              </div>
            </div>

            <EditableLine
              label="SEO title"
              value={seoTitle}
              fallback={titleFallback}
              placeholder="Add an SEO title"
              onChange={update('seoTitle')}
              style={{fontSize: 20, lineHeight: '26px', color: '#1a0dab', maxWidth: RESULT_WIDTH}}
              previewStyle={{
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: RESULT_WIDTH,
              }}
            />

            <div style={{height: 6}} />

            <EditableLine
              label="SEO description"
              multiline
              value={seoDescription}
              fallback={excerpt}
              placeholder="Add an SEO description"
              onChange={update('seoDescription')}
              style={{fontSize: 14, lineHeight: '22px', color: '#4d5156', maxWidth: RESULT_WIDTH}}
              previewStyle={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: RESULT_WIDTH,
              }}
            />
          </div>
        </div>

        <Stack space={2}>
          <LengthNote
            label="Title"
            text={shownTitle}
            width={textWidth(shownTitle, TITLE_FONT)}
            max={RESULT_WIDTH}
            custom={Boolean(seoTitle)}
          />
          <LengthNote
            label="Description"
            text={shownDescription}
            width={textWidth(shownDescription, DESCRIPTION_FONT)}
            max={DESCRIPTION_MAX_WIDTH}
            custom={Boolean(seoDescription)}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
