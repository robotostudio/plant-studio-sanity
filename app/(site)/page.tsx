import {Suspense} from 'react'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import Faq from '@/app/components/Faq'
import {LatestPosts} from '@/app/components/Posts'
import SideBySideIcons from '@/app/components/SideBySideIcons'
import {studioUrl} from '@/sanity/lib/api'
import * as demo from '@/sanity/lib/demo'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <>
      <div className="relative">
        <div className="relative bg-[url(/images/tile-1-black.png)] bg-size-[5px]">
          <div className="bg-gradient-to-b from-white w-full h-full absolute top-0"></div>
          <div className="container">
            <div className="relative min-h-[40svh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-30 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-4 items-center">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black text-center">
                  {settings?.title || demo.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <SideBySideIcons />
          <div className="container relative mx-auto max-w-2xl pb-20 pt-10 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-gray-700 prose-a:text-gray-700 font-light text-center">
              {settings?.description && (
                <div
                  data-sanity={dataAttr({
                    id: settings._id,
                    type: 'settings',
                    path: 'description',
                  }).toString()}
                >
                  <PortableText value={settings.description} />
                </div>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3 not-prose">
                <Link
                  href="/posts"
                  className="rounded-full inline-flex items-center font-mono whitespace-nowrap bg-black hover:bg-blue focus:bg-blue py-3 px-6 text-white transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none"
                >
                  Read the posts
                </Link>
                <Link
                  href={studioUrl}
                  className="rounded-full inline-flex items-center font-mono whitespace-nowrap border border-black py-3 px-6 hover:bg-black hover:text-white focus:bg-black focus:text-white transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none"
                >
                  Open Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>
              <LatestPosts />
            </Suspense>
          </aside>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="container">
          <Suspense>
            <Faq />
          </Suspense>
        </div>
      </div>
    </>
  )
}
