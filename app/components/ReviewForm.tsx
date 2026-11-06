'use client'

import {useActionState} from 'react'

import StarRatingInput from '@/app/components/StarRatingInput'
import {submitReview, type ReviewFormState} from '@/app/reviews-action'

const initialState: ReviewFormState = {status: 'idle', message: ''}

export default function ReviewForm() {
  const [state, formAction, pending] = useActionState(submitReview, initialState)

  if (state.status === 'success') {
    return (
      <p role="status" className="rounded-lg border border-gray-200 p-6 text-lg text-gray-900">
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} className="grid gap-5 max-w-xl">
      <label className="grid gap-1 text-gray-900">
        Your name
        <input
          name="reviewer"
          required
          maxLength={100}
          className="rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>
      <fieldset className="grid gap-1 text-gray-900">
        <legend>Rating</legend>
        <StarRatingInput name="rating" />
      </fieldset>
      <label className="grid gap-1 text-gray-900">
        Your review
        <textarea
          name="text"
          required
          rows={5}
          maxLength={2000}
          className="rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>
      {/* Spam trap: hidden from people, left empty by them. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === 'error' && (
        <p role="alert" className="text-red-600">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-black px-6 py-3 text-white justify-self-start hover:bg-blue focus:bg-blue disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send review'}
      </button>
    </form>
  )
}
