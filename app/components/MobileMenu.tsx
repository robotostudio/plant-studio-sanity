'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useId, useState} from 'react'

type NavLink = {href: string; label: string}

export default function MobileMenu({links}: {links: NavLink[]}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const panelId = useId()

  return (
    <div className="md:hidden" onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white hover:border-black transition-[border-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none"
      >
        <svg
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav
          id={panelId}
          aria-label="Main"
          className="absolute inset-x-0 top-24 z-40 border-y border-gray-200 bg-white shadow-layer"
        >
          <ul role="list" className="container flex flex-col py-4 font-mono text-lg">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="block py-3 hover:underline aria-[current=page]:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
