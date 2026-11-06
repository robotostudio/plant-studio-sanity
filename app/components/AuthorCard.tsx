import Link from 'next/link'

import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import type {authorsQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

type Authors = NonNullable<Awaited<ReturnType<typeof sanityFetch<typeof authorsQuery>>>['data']>
export type AuthorCardData = Authors[number]

export default function AuthorCard({author}: {author: AuthorCardData}) {
  const {_id, firstName, lastName, slug, picture, bio, postCount} = author
  const name = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <article
      data-sanity={dataAttr({id: _id, type: 'person', path: 'firstName'}).toString()}
      className="border border-gray-200 rounded-sm p-6 bg-gray-50 flex flex-col gap-4 transition-colors hover:bg-white relative"
    >
      <Link aria-label={name} className="absolute inset-0 z-10" href={`/authors/${slug}`} />
      <div className="flex items-center gap-4">
        {picture?.asset?._ref ? (
          <Image
            id={picture.asset._ref}
            alt={picture.alt || ''}
            className="h-16 w-16 rounded-full"
            height={128}
            width={128}
            hotspot={picture.hotspot}
            crop={picture.crop}
            mode="cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200" />
        )}
        <div>
          <h3 className="text-2xl">{name}</h3>
          <p className="text-gray-500 text-xs font-mono tabular-nums">
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>
      {bio && <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch]">{bio}</p>}
    </article>
  )
}
