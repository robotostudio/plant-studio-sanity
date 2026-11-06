import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PostGrid} from '@/app/components/Posts'
import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {authorQuery, authorSlugsQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: authorSlugsQuery,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/authors/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: author} = await sanityFetch({
    query: authorQuery,
    params,
    stega: false,
  })
  const name = [author?.firstName, author?.lastName].filter(Boolean).join(' ')
  return {
    title: name || 'Author',
    description: author?.bio ?? undefined,
  }
}

export default async function AuthorPage(props: PageProps<'/authors/[slug]'>) {
  const params = await props.params
  const {data: author} = await sanityFetch({query: authorQuery, params})

  if (!author?._id) {
    notFound()
  }

  const {_id, firstName, lastName, picture, bio, posts} = author
  const name = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <>
      <div className="container py-12 sm:py-20">
        <div
          className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10"
          data-sanity={dataAttr({id: _id, type: 'person', path: 'firstName'}).toString()}
        >
          {picture?.asset?._ref && (
            <Image
              id={picture.asset._ref}
              alt={picture.alt || ''}
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-full"
              height={288}
              width={288}
              hotspot={picture.hotspot}
              crop={picture.crop}
              mode="cover"
            />
          )}
          <div>
            <p className="text-md leading-6 uppercase font-mono text-gray-500">Author</p>
            <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-6xl">{name}</h1>
            {bio && <p className="mt-4 text-lg leading-8 text-gray-600 max-w-[70ch]">{bio}</p>}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-12 sm:py-20">
          <h2 className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">Posts by {firstName}</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
          <div className="pt-6">
            {posts.length > 0 ? (
              <PostGrid posts={posts} />
            ) : (
              <p className="text-lg text-gray-600">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
