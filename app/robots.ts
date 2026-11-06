import type {MetadataRoute} from 'next'

import {siteUrl} from '@/app/site-url'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await siteUrl()
  return {
    rules: [{userAgent: '*', allow: '/', disallow: ['/studio', '/api/']}],
    sitemap: `${base}/sitemap.xml`,
  }
}
