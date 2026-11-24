'use client'

import {useRef} from 'react'
import {stegaClean} from '@sanity/client/stega'

import StarRating from '@/app/components/StarRating'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'

type ReviewCarouselProps = {
  block: ExtractPageBuilderType<'reviewCarousel'>
  index: number
  pageId: string
  pageType: string
}

/** Page builder block: reviews in a horizontally scrolling, snapping carousel. */
export default function ReviewCarousel({block}: ReviewCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const reviews = (block.reviews ?? []).filter((review) => review?.quote)
  if (reviews.length === 0) {
    return null
  }

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth
    track.scrollBy({left: direction * step, behavior: 'smooth'})
  }

  const headingId = `reviews-${block._key}`

  return (
    <section aria-labelledby={headingId} className="py-12 sm:py-20 bg-gray-50 border-y border-gray-100">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h2 id={headingId} className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
              {block.heading || 'Reviews'}
            </h2>
            {block.subheading && (
              <p className="mt-2 text-lg leading-8 text-gray-600">{block.subheading}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="size-12 rounded-full border border-gray-300 bg-white font-mono text-lg hover:bg-black hover:text-white transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="size-12 rounded-full border border-gray-300 bg-white font-mono text-lg hover:bg-black hover:text-white transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:thin] motion-reduce:scroll-auto"
        >
          {reviews.map((review) => {
            const rating = Number(stegaClean(review.rating) ?? 0)
            return (
              <li
                key={review._key}
                className="snap-start shrink-0 basis-[85%] sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)] flex flex-col rounded-sm border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} />
                  <span className="text-sm text-gray-600">{rating} out of 5</span>
                </div>
                {review.title && (
                  <p className="mt-3 font-bold text-gray-900">{review.title}</p>
                )}
                <blockquote className="mt-2 text-base leading-7 text-gray-700 grow">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <footer className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{review.author}</p>
                  {review.role && <p className="text-sm text-gray-500">{review.role}</p>}
                </footer>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
