import type {ExtractPageBuilderType} from '@/sanity/lib/types'
import {dataAttr} from '@/sanity/lib/utils'

/**
 * Presentational FAQ accordion. No server imports, so it can render inside the
 * client-side page builder as well as on the server-rendered home page.
 */
export type FaqItem = {_id: string; question: string | null; answer: string | null}

export function FaqList({
  heading,
  subheading,
  items,
  headingId,
}: {
  heading: string
  subheading?: string | null
  items: FaqItem[]
  headingId: string
}) {
  return (
    <section aria-labelledby={headingId} className="py-12 sm:py-20">
      <h2 id={headingId} className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
      {subheading && <p className="mt-2 text-lg leading-8 text-gray-600">{subheading}</p>}
      <div className="pt-6 space-y-4">
        {items.map((item) => (
          <details
            key={item._id}
            data-sanity={dataAttr({id: item._id, type: 'faq', path: 'question'}).toString()}
            className="group border border-gray-200 rounded-sm bg-gray-50 open:bg-white transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-lg sm:text-xl [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="font-mono text-2xl text-gray-500 transition-transform duration-150 ease-out group-open:rotate-45 motion-reduce:transition-none"
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

/** Page builder block: the entries an editor picked for this page. */
export default function FaqSectionBlock({block}: {block: ExtractPageBuilderType<'faqSection'>}) {
  const items = (block.items ?? []).filter((item) => item && item.question)
  if (items.length === 0) {
    return null
  }

  return (
    <div className="container">
      <FaqList
        heading={block.heading || 'FAQ'}
        subheading={block.subheading}
        items={items}
        headingId={`faq-${block._key}`}
      />
    </div>
  )
}
