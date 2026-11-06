import type {MetadataRoute} from 'next'

import {siteUrl} from '@/app/site-url'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

/**
 * sitemap.xml for the site. Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{data}, base] = await Promise.all([sanityFetch({query: sitemapData}), siteUrl()])
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {url: base, lastModified: now, priority: 1, changeFrequency: 'weekly'},
    {url: `${base}/posts`, lastModified: now, priority: 0.8, changeFrequency: 'weekly'},
    {url: `${base}/authors`, lastModified: now, priority: 0.6, changeFrequency: 'monthly'},
  ]

  for (const doc of data ?? []) {
    if (!doc.slug) continue
    const lastModified = doc._updatedAt || now
    switch (doc._type) {
      case 'page':
        entries.push({url: `${base}/${doc.slug}`, lastModified, priority: 0.8, changeFrequency: 'monthly'})
        break
      case 'post':
        entries.push({url: `${base}/posts/${doc.slug}`, lastModified, priority: 0.5, changeFrequency: 'never'})
        break
      case 'person':
        entries.push({url: `${base}/authors/${doc.slug}`, lastModified, priority: 0.4, changeFrequency: 'monthly'})
        break
    }
  }

  return entries
}
