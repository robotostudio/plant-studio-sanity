'use client'

/**
 * Client boundary for the embedded Studio: sanity.config.ts pulls in Studio code that
 * must not run in React Server Components, so the page only renders this component.
 */
import {NextStudio} from 'next-sanity/studio'

import config from '@/sanity.config'

export default function Studio() {
  return <NextStudio config={config} />
}
