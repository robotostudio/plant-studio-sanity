import {headers} from 'next/headers'

/**
 * Absolute origin of the current deployment, from the request headers.
 * Used by robots.txt, sitemap.xml and the RSS feed, which need full URLs.
 */
export async function siteUrl() {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host') ?? 'localhost:3000'
  const protocol =
    headersList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${protocol}://${host}`
}
