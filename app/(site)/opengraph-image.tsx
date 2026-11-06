import {ImageResponse} from 'next/og'

import {OgCard, ogAssets, ogSize} from '@/app/og-card'
import {client} from '@/sanity/lib/client'
import * as demo from '@/sanity/lib/demo'
import {settingsQuery} from '@/sanity/lib/queries'

export const alt = 'Site preview'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 3600

export default async function Image() {
  const [settings, {fonts, tile}] = await Promise.all([
    client.fetch(settingsQuery, {}, {stega: false}),
    ogAssets(),
  ])

  return new ImageResponse(<OgCard tile={tile} eyebrow="A starter template for" title={settings?.title || demo.title} />, {
    ...size,
    fonts,
  })
}
