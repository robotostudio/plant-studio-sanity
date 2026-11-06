'use client'

import {useState, type FormEvent} from 'react'

import StarRatingInput from '@/app/components/StarRatingInput'

type FormState = {status: 'idle' | 'success' | 'error'; message: string}

export default function ReviewForm() {
  const [state, setState] = useState<FormState>({status: 'idle', message: ''})
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      })
      const data: {message?: string} = await response.json().catch(() => ({}))
      setState({
        status: response.ok ? 'success' : 'error',
        message: data.message ?? 'Something went wrong. Please try again.',
      })
    } catch {
      setState({status: 'error', message: 'Something went wrong. Please try again.'})
    } finally {
      setPending(false)
    }
  }

  if (state.status === 'success') {
    return (
      <p role="status" className="rounded-lg border border-gray-200 p-6 text-lg text-gray-900">
        {state.message}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 max-w-xl">
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
