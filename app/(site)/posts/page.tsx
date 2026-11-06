import type {Metadata} from 'next'
import Link from 'next/link'
import {Suspense} from 'react'

import {PostGrid} from '@/app/components/Posts'
import PostsSearch from '@/app/components/PostsSearch'
import {sanityFetch} from '@/sanity/lib/live'
import {postsCountQuery, postsQuery} from '@/sanity/lib/queries'

const PAGE_SIZE = 9

export const metadata: Metadata = {title: 'Posts'}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function PostsPage(props: PageProps<'/posts'>) {
  const searchParams = await props.searchParams
  const term = (first(searchParams.q) ?? '').trim()
  // GROQ match works on words; the trailing * makes it a prefix match.
  const q = term ? `${term}*` : ''

  const {data: total} = await sanityFetch({query: postsCountQuery, params: {q}})
  const count = total ?? 0
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const requested = Math.max(1, Math.floor(Number(first(searchParams.page))) || 1)
  const page = Math.min(requested, pageCount)
  const start = (page - 1) * PAGE_SIZE

  const {data: posts} = await sanityFetch({
    query: postsQuery,
    params: {q, start, end: start + PAGE_SIZE},
  })

  const pageHref = (target: number) => {
    const params = new URLSearchParams()
    if (term) params.set('q', term)
    if (target > 1) params.set('page', String(target))
    const query = params.toString()
    return query ? `/posts?${query}` : '/posts'
  }

  return (
    <div className="container py-12 sm:py-20">
      <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-6xl">All posts</h1>
      <p className="mt-2 text-lg leading-8 text-gray-600 tabular-nums" aria-live="polite">
        {term
          ? `${count} ${count === 1 ? 'result' : 'results'} for "${term}"`
          : `${count} ${count === 1 ? 'post' : 'posts'}, newest first.`}
      </p>

      <Suspense>
        <PostsSearch />
      </Suspense>

      <div className="pt-10">
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <p className="text-lg text-gray-600">
            No posts found.{' '}
            {term && (
              <Link href="/posts" className="underline hover:text-brand">
                Clear search
              </Link>
            )}
          </p>
        )}
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 font-mono text-sm"
        >
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="rounded-full border border-black py-3 px-6 font-mono hover:bg-black hover:text-white focus:bg-black focus:text-white transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none">
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-gray-500">
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} className="rounded-full border border-black py-3 px-6 font-mono hover:bg-black hover:text-white focus:bg-black focus:text-white transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none">
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
