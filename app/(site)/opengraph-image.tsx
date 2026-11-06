import {toPlainText} from 'next-sanity'
import {ImageResponse} from 'next/og'

import {clamp, OgCard, ogFonts, ogSize} from '@/app/og-card'
import {client} from '@/sanity/lib/client'
import * as demo from '@/sanity/lib/demo'
import {settingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export const alt = 'Site preview'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 3600

export default async function Image() {
  const settings = await client.fetch(settingsQuery, {}, {stega: false})
  const title = settings?.title || demo.title
  const description = clamp(toPlainText(settings?.description || demo.description), 170)
  // An image set in Studio settings becomes the right-hand panel of the card.
  const editorImage = settings?.ogImage?.asset
    ? urlForImage(settings.ogImage).width(540).height(630).fit('crop').url()
    : null

  return new ImageResponse(
    <OgCard title={title} description={description} image={editorImage} />,
    {...size, fonts: await ogFonts()},
  )
}
