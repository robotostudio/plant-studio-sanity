'use client'

import {useCallback, useEffect, useRef, useState} from 'react'

import StarRating from '@/app/components/StarRating'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'
import {stegaClean} from '@sanity/client/stega'

type ReviewCarouselProps = {
  block: ExtractPageBuilderType<'reviewCarousel'>
  index: number
  pageId: string
  pageType: string
}

export default function ReviewCarousel({block}: ReviewCarouselProps) {
  const reviews = (block.reviews ?? []).filter((review) => review?.quote)
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update, reviews.length])

  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-review-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth
    el.scrollBy({left: step * direction, behavior: 'smooth'})
  }

  if (reviews.length === 0) {
    return null
  }

  const ratings = reviews.map((review) => Number(stegaClean(review.rating)) || 0)
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

  const headingId = `reviews-${block._key}`

  return (
    <section aria-labelledby={headingId} className="container py-12 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h2 id={headingId} className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
            {block.heading || 'Reviews'}
          </h2>
          {block.subheading && (
            <p className="mt-2 text-lg leading-8 text-gray-600">{block.subheading}</p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={average} size={24} />
            <span className="text-base text-gray-900">
              {(Math.round(average * 10) / 10).toFixed(1)} out of 5
            </span>
            <span className="text-sm text-[#007185]">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Previous reviews"
            className="h-11 w-11 rounded-full border border-gray-300 font-mono text-lg transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Next reviews"
            className="h-11 w-11 rounded-full border border-gray-300 font-mono text-lg transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={update}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:thin]"
      >
        {reviews.map((review, i) => (
          <figure
            key={review._key}
            data-review-card
            className="flex w-[85%] shrink-0 snap-start flex-col gap-3 rounded-sm border border-gray-200 bg-white p-6 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="flex items-center gap-2">
              <StarRating rating={ratings[i]} />
              {review.title && <span className="font-bold text-gray-900">{review.title}</span>}
            </div>
            <span className="text-xs font-bold text-[#c45500]">Verified Client</span>
            <blockquote className="text-base leading-7 text-gray-700">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            {(review.author || review.role) && (
              <figcaption className="mt-auto pt-4 border-t border-gray-100 text-sm">
                {review.author && <span className="block text-gray-900">{review.author}</span>}
                {review.role && <span className="block text-gray-500">{review.role}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}
