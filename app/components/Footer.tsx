import Link from 'next/link'

import {studioUrl} from '@/sanity/lib/api'

export default function Footer() {
  return (
    <footer className="bg-gray-50 relative">
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] bg-size-[17px] opacity-20 bg-position-[0_1]" />
      <div className="container relative">
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-center text-4xl font-mono leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-2xl">
            Built with Sanity + Next.js.
          </h3>
          <div className="flex flex-col gap-3 items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
            <Link
              href={studioUrl}
              className="rounded-full flex gap-2 font-mono whitespace-nowrap items-center bg-black hover:bg-blue focus:bg-blue py-3 px-6 text-white transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none"
            >
              Open Studio
            </Link>
            <a
              href="https://github.com/robotostudio/plant-studio-sanity"
              className="mx-3 py-2 hover:underline font-mono"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
