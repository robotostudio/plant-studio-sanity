import {siteUrl} from '@/app/site-url'
import {client} from '@/sanity/lib/client'
import {allPostsQuery, settingsQuery} from '@/sanity/lib/queries'

const escape = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => ({'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'})[char]!)

export async function GET() {
  const [posts, settings, base] = await Promise.all([
    client.fetch(allPostsQuery),
    client.fetch(settingsQuery),
    siteUrl(),
  ])
  const title = settings?.title || 'Posts'
  const items = posts
    .map((post) => {
      const author = [post.author?.firstName, post.author?.lastName].filter(Boolean).join(' ')
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${base}/posts/${post.slug}</link>
      <guid isPermaLink="true">${base}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>${
        post.excerpt ? `\n      <description>${escape(post.excerpt)}</description>` : ''
      }${author ? `\n      <dc:creator>${escape(author)}</dc:creator>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(title)}</title>
    <link>${base}/posts</link>
    <description>${escape(`Posts from ${title}`)}</description>
    <language>en</language>
    <atom:link href="${base}/posts/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
