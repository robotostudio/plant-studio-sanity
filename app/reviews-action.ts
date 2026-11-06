'use server'

import {createClient} from '@sanity/client'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

export type ReviewFormState = {status: 'idle' | 'success' | 'error'; message: string}

/**
 * Saves a visitor's review in Sanity as an unpublished draft, so it only
 * appears on the site after someone publishes it in the Studio.
 */
export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  // Hidden field that real visitors never fill in; bots often do.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return {status: 'success', message: 'Thank you! Your review has been sent.'}
  }

  const reviewer = String(formData.get('reviewer') ?? '').trim().slice(0, 100)
  const text = String(formData.get('text') ?? '').trim().slice(0, 2000)
  const rating = Number(formData.get('rating'))

  if (!reviewer || !text || !Number.isInteger(rating * 2) || rating < 0.5 || rating > 5) {
    return {status: 'error', message: 'Please add your name, a star rating and your review.'}
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN
  if (!writeToken) {
    return {status: 'error', message: 'Reviews cannot be sent right now. Please try again later.'}
  }

  try {
    const writeClient = createClient({projectId, dataset, apiVersion, useCdn: false, token: writeToken})
    await writeClient.create({
      _id: `drafts.${crypto.randomUUID()}`,
      _type: 'review',
      reviewer,
      rating,
      text,
      date: new Date().toISOString().slice(0, 10),
    })
  } catch {
    return {status: 'error', message: 'Something went wrong sending your review. Please try again.'}
  }

  return {status: 'success', message: 'Thank you! Your review has been sent.'}
}
