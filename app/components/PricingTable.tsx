import type {ExtractPageBuilderType} from '@/sanity/lib/types'

/** Page builder block: pricing plans shown side by side. */
export default function PricingTable({block}: {block: ExtractPageBuilderType<'pricingTable'>}) {
  const plans = (block.plans ?? []).filter((plan) => plan && plan.name)
  if (plans.length === 0) {
    return null
  }

  return (
    <section aria-labelledby={`pricing-${block._key}`} className="container py-12 sm:py-20">
      <h2 id={`pricing-${block._key}`} className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
        {block.heading || 'Pricing'}
      </h2>
      {block.subheading && (
        <p className="mt-2 text-lg leading-8 text-gray-600">{block.subheading}</p>
      )}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan._key}
            className={`flex flex-col rounded-sm border p-8 ${
              plan.highlighted ? 'border-black bg-white' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <h3 className="text-xl text-gray-900">{plan.name}</h3>
            {plan.description && <p className="mt-2 text-gray-600">{plan.description}</p>}
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl text-gray-900">{plan.price}</span>
              {plan.period && <span className="font-mono text-sm text-gray-500">{plan.period}</span>}
            </p>
            {plan.features && plan.features.length > 0 && (
              <ul role="list" className="mt-6 space-y-3 text-gray-700">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="font-mono text-gray-500">
                      +
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
