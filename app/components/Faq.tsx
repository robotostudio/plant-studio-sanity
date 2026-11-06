import {sanityFetch} from '@/sanity/lib/live'
import {faqQuery} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

export default async function Faq() {
  const {data} = await sanityFetch({query: faqQuery})

  if (!data || data.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="faq-heading" className="py-12 sm:py-20">
      <h2 id="faq-heading" className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
        FAQ
      </h2>
      <p className="mt-2 text-lg leading-8 text-gray-600">
        Short answers about the stack behind this site.
      </p>
      <div className="pt-6 space-y-4">
        {data.map((item) => (
          <details
            key={item._id}
            data-sanity={dataAttr({id: item._id, type: 'faq', path: 'question'}).toString()}
            className="group border border-gray-200 rounded-sm bg-gray-50 open:bg-white transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-lg sm:text-xl [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="font-mono text-2xl text-gray-500 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="px-6 pb-6 text-base leading-7 text-gray-600 max-w-[70ch]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
