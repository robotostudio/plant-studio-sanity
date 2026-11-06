import {createClient} from '@sanity/client'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

/**
 * Receives a review from the Reviews page and saves it in Sanity as an
 * unpublished draft, so it only appears on the site once someone publishes it
 * in the Studio.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({message: 'Invalid request.'}, {status: 400})
  }

  // Hidden field that real visitors never fill in; bots often do.
  if (String(body.website ?? '').trim() !== '') {
    return Response.json({message: 'Thank you! Your review has been sent.'})
  }

  const reviewer = String(body.reviewer ?? '').trim().slice(0, 100)
  const text = String(body.text ?? '').trim().slice(0, 2000)
  const rating = Number(body.rating)

  if (!reviewer || !text || !Number.isInteger(rating * 2) || rating < 0.5 || rating > 5) {
    return Response.json(
      {message: 'Please add your name, a star rating and your review.'},
      {status: 400},
    )
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN
  if (!writeToken) {
    return Response.json(
      {message: 'Reviews cannot be sent right now. Please try again later.'},
      {status: 503},
    )
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
    return Response.json(
      {message: 'Something went wrong sending your review. Please try again.'},
      {status: 500},
    )
  }

  return Response.json({message: 'Thank you! Your review has been sent.'})
}
