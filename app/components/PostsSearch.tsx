'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useRef} from 'react'

/**
 * URL-driven search: typing updates ?q= (debounced) and the server component re-renders
 * the results. The form still submits on Enter, so it works without JavaScript too.
 */
export default function PostsSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlTerm = searchParams.get('q') ?? ''
  const inputRef = useRef<HTMLInputElement>(null)
  const lastPushed = useRef(urlTerm)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The URL changed from outside (back button, "Clear search"): mirror it into the input.
  useEffect(() => {
    if (urlTerm !== lastPushed.current && inputRef.current) {
      inputRef.current.value = urlTerm
      lastPushed.current = urlTerm
    }
  }, [urlTerm])

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  const onChange = (value: string) => {
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      const next = value.trim()
      const params = new URLSearchParams(searchParams)
      if (next) params.set('q', next)
      else params.delete('q')
      params.delete('page')
      lastPushed.current = next
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {scroll: false})
    }, 300)
  }

  return (
    <form action={pathname} method="get" role="search" className="mt-8 max-w-xl">
      <label htmlFor="q" className="sr-only">
        Search posts
      </label>
      <input
        ref={inputRef}
        id="q"
        name="q"
        type="search"
        defaultValue={urlTerm}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search posts"
        autoComplete="off"
        className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 font-mono text-sm focus:border-black focus:outline-none"
      />
    </form>
  )
}
