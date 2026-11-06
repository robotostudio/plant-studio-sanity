import { sanityFetch } from "@/sanity/lib/fetch";
import { faqQuery } from "@/sanity/lib/queries";

export default async function Faq() {
  const items = await sanityFetch({ query: faqQuery });
  if (!items?.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="mb-32">
      <h2
        id="faq-heading"
        className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl"
      >
        FAQ
      </h2>
      <div className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <details key={item._id} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-2xl font-bold leading-snug [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="text-3xl transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-pretty mt-4 max-w-3xl text-lg leading-relaxed">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
