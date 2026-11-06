import Link from 'next/link'

import MobileMenu from '@/app/components/MobileMenu'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'

const navLinks = [
  {href: '/posts', label: 'Posts'},
  {href: '/authors', label: 'Authors'},
  {href: '/about', label: 'About'},
]

export default async function Header() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <header className="fixed z-50 h-24 inset-x-0 top-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="text-lg sm:text-2xl pl-2 font-semibold">
              {settings?.title || 'Sanity + Next.js'}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-2.5 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="before:w-[1px] before:bg-gray-200 before:block flex gap-4 md:gap-6">
                <Link
                  className="rounded-full flex gap-4 items-center bg-black hover:bg-blue focus:bg-blue py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none"
                  href={studioUrl}
                >
                  <span className="whitespace-nowrap">Open Studio</span>
                </Link>
              </li>
            </ul>
          </nav>
          <MobileMenu links={[{href: '/', label: 'Home'}, ...navLinks, {href: studioUrl, label: 'Open Studio'}]} />
        </div>
      </div>
    </header>
  )
}
