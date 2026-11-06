import {format} from 'date-fns'
import {ImageResponse} from 'next/og'

import {clamp, OgCard, ogFonts, ogSize} from '@/app/og-card'
import {client} from '@/sanity/lib/client'
import {postOgQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export const alt = 'Post preview'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 3600

export default async function Image({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [post, settings] = await Promise.all([
    client.fetch(postOgQuery, {slug}, {stega: false}),
    client.fetch(settingsQuery, {}, {stega: false}),
  ])
  const author = [post?.author?.firstName, post?.author?.lastName].filter(Boolean).join(' ')
  const footer = [author, post?.date ? format(new Date(post.date), 'LLLL d, yyyy') : null]
    .filter(Boolean)
    .join('  ·  ')
  const cover = post?.coverImage?.asset
    ? urlForImage(post.coverImage).width(540).height(630).fit('crop').url()
    : null

  return new ImageResponse(
    <OgCard
      eyebrow={settings?.title || undefined}
      title={post?.title || 'Post'}
      description={clamp(post?.excerpt, cover ? 110 : 170)}
      footer={footer || null}
      image={cover}
    />,
    {...size, fonts: await ogFonts()},
  )
}
