import {createClient} from '@sanity/client'
import {z} from 'zod'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

const reviewSchema = z.object({
  reviewer: z.string().trim().min(1).max(100),
  text: z.string().trim().min(1).max(2000),
  // Half-star steps from 0.5 to 5.
  rating: z.coerce
    .number()
    .min(0.5)
    .max(5)
    .refine((value) => Number.isInteger(value * 2)),
  // Hidden spam-trap field: real visitors leave it empty.
  website: z.string().optional(),
})

/**
 * Receives a review from the Reviews page and saves it in Sanity as a
 * published review, so it shows on the site straight away.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({message: 'Invalid request.'}, {status: 400})
  }

  const parsed = reviewSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      {message: 'Please add your name, a star rating and your review.'},
      {status: 400},
    )
  }

  const {reviewer, text, rating, website} = parsed.data

  if (website && website.trim() !== '') {
    return Response.json({message: 'Thank you! Your review has been sent.'})
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
      _id: crypto.randomUUID(),
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
