import type {Metadata} from 'next'

import DateComponent from '@/app/components/Date'
import Stars from '@/app/components/Stars'
import {sanityFetch} from '@/sanity/lib/live'
import {reviewsQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

export const metadata: Metadata = {title: 'Reviews'}

export default async function ReviewsPage() {
  const {data: reviews} = await sanityFetch({query: reviewsQuery})

  return (
    <div className="container py-12 sm:py-20">
      <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-6xl">Reviews</h1>
      <p className="mt-2 text-lg leading-8 text-gray-600">What people say about us.</p>
      {reviews.length > 0 ? (
        <div className="pt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review._id}
              data-sanity={dataAttr({id: review._id, type: 'review', path: 'reviewer'}).toString()}
              className="border border-gray-200 rounded-sm p-6 bg-gray-50 flex flex-col gap-3"
            >
              <Stars rating={review.rating ?? 0} id={review._id} />
              {review.text && (
                <p className="text-base leading-7 text-gray-700 whitespace-pre-line">{review.text}</p>
              )}
              <div className="mt-auto pt-2">
                <p className="font-semibold">{review.reviewer}</p>
                <p className="text-gray-500 text-xs font-mono">
                  <DateComponent dateString={review.date} />
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="pt-8 text-lg text-gray-600">No reviews yet.</p>
      )}
    </div>
  )
}
