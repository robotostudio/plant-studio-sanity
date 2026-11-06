import type {Metadata} from 'next'
import {defineQuery} from 'next-sanity'

import DateComponent from '@/app/components/Date'
import Stars from '@/app/components/Stars'
import ReviewForm from '@/app/components/ReviewForm'
import {sanityFetch} from '@/sanity/lib/live'

export const metadata: Metadata = {title: 'Reviews'}

const reviewsQuery = defineQuery(`
  *[_type == "review"] | order(date desc, _createdAt desc) {_id, reviewer, rating, text, date}
`)

type Review = {_id: string; reviewer: string; rating: number; text: string; date?: string}

export default async function ReviewsPage() {
  const {data} = await sanityFetch({query: reviewsQuery})
  const reviews = (data ?? []) as Review[]

  return (
    <div className="container py-12 sm:py-20">
      <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-6xl">Reviews</h1>
      <p className="mt-2 text-lg leading-8 text-gray-600">What people say.</p>

      {reviews.length > 0 ? (
        <ul role="list" className="pt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review._id} className="rounded-lg border border-gray-200 p-6">
              <Stars value={review.rating} />
              <p className="mt-3 text-gray-900">{review.text}</p>
              <p className="mt-4 text-sm text-gray-600">
                {review.reviewer}
                {review.date && (
                  <>
                    {' · '}
                    <DateComponent dateString={review.date} />
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="pt-8 text-lg text-gray-600">No reviews yet.</p>
      )}

      <h2 className="pt-16 pb-6 text-2xl text-gray-900 sm:text-3xl">Leave a review</h2>
      <ReviewForm />
    </div>
  )
}
