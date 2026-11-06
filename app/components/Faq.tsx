import {FaqList} from '@/app/components/FaqSection'
import {sanityFetch} from '@/sanity/lib/live'
import {faqQuery} from '@/sanity/lib/queries'

/** Home page: every FAQ entry, oldest first. */
export default async function Faq() {
  const {data} = await sanityFetch({query: faqQuery})

  if (!data || data.length === 0) {
    return null
  }

  return (
    <FaqList
      heading="FAQ"
      subheading="Short answers about the stack behind this site."
      items={data}
      headingId="faq-heading"
    />
  )
}
