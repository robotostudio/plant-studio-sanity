import type {Metadata} from 'next'

import AuthorCard from '@/app/components/AuthorCard'
import {sanityFetch} from '@/sanity/lib/live'
import {authorsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {title: 'Authors'}

export default async function AuthorsPage() {
  const {data: authors} = await sanityFetch({query: authorsQuery})

  return (
    <div className="container py-12 sm:py-20">
      <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-6xl">Authors</h1>
      <p className="mt-2 text-lg leading-8 text-gray-600">The people writing on this site.</p>
      {authors.length > 0 ? (
        <div className="pt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <AuthorCard key={author._id} author={author} />
          ))}
        </div>
      ) : (
        <p className="pt-8 text-lg text-gray-600">No authors yet.</p>
      )}
    </div>
  )
}
