import {format} from 'date-fns'
import {ImageResponse} from 'next/og'

import {OgCard, clamp, ogAssets, ogSize} from '@/app/og-card'
import {client} from '@/sanity/lib/client'
import * as demo from '@/sanity/lib/demo'
import {postOgQuery, settingsQuery} from '@/sanity/lib/queries'

export const alt = 'Post preview'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 3600

export default async function Image({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [post, settings, {fonts, tile}] = await Promise.all([
    client.fetch(postOgQuery, {slug}, {stega: false}),
    client.fetch(settingsQuery, {}, {stega: false}),
    ogAssets(),
  ])
  const author = [post?.author?.firstName, post?.author?.lastName].filter(Boolean).join(' ')
  const meta = [author, post?.date ? format(new Date(post.date), 'LLLL d, yyyy') : null]
    .filter(Boolean)
    .join('  ·  ')

  return new ImageResponse(
    <OgCard
      tile={tile}
      eyebrow={settings?.title || demo.title}
      title={clamp(post?.title, 70) || 'Post'}
      meta={meta || null}
      compact
    />,
    {...size, fonts},
  )
}
