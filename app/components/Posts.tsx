import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {latestPostsQuery, morePostsQuery} from '@/sanity/lib/queries'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {dataAttr} from '@/sanity/lib/utils'

// Derived from the live fetch so the stega-wrapped strings type-check.
type LatestPosts = NonNullable<Awaited<ReturnType<typeof sanityFetch<typeof latestPostsQuery>>>['data']>
export type PostCard = LatestPosts[number]

export const Post = ({post}: {post: PostCard}) => {
  const {_id, title, slug, excerpt, date, author} = post

  return (
    <article
      data-sanity={dataAttr({id: _id, type: 'post', path: 'title'}).toString()}
      key={_id}
      className="border border-gray-200 rounded-sm p-6 bg-gray-50 flex flex-col justify-between transition-colors hover:bg-white relative"
    >
      <Link className="hover:text-brand underline transition-colors" href={`/posts/${slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      <div>
        <h3 className="text-2xl mb-4">{title}</h3>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch]">{excerpt}</p>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        {author && author.firstName && author.lastName && (
          <Link
            href={author.slug ? `/authors/${author.slug}` : '/authors'}
            className="relative z-20 flex items-center hover:underline"
          >
            <Avatar person={author} small={true} />
          </Link>
        )}
        <time className="text-gray-500 text-xs font-mono" dateTime={date}>
          <DateComponent dateString={date} />
        </time>
      </div>
    </article>
  )
}

export const PostGrid = ({posts}: {posts: PostCard[]}) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {posts.map((post) => (
      <Post key={post._id} post={post} />
    ))}
  </div>
)

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && <h2 className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">{heading}</h2>}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600">{subHeading}</p>}
    <div className="pt-6 space-y-6">{children}</div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const LatestPosts = async () => {
  const {data} = await sanityFetch({query: latestPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts heading="Recent Posts" subHeading="The five most recent posts from the Studio.">
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      <div className="pt-4">
        <Link
          href="/posts"
          className="rounded-full inline-flex gap-2 font-mono whitespace-nowrap items-center bg-black hover:bg-blue focus:bg-blue py-3 px-6 text-white transition-colors duration-200"
        >
          See all posts
        </Link>
      </div>
    </Posts>
  )
}
