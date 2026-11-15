import {TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder block that shows pricing plans side by side.
 */
export const pricingTable = defineType({
  name: 'pricingTable',
  title: 'Pricing Table',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Pricing'}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'plan',
          title: 'Plan',
          fields: [
            defineField({
              name: 'name',
              title: 'Plan name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'price', title: 'Price', type: 'string'}),
            defineField({
              name: 'period',
              title: 'Billing period',
              type: 'string',
              description: 'For example "per month"',
            }),
            defineField({name: 'description', title: 'Description', type: 'string'}),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            defineField({
              name: 'highlighted',
              title: 'Highlight this plan',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'price'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', plans: 'plans'},
    prepare({title, plans}) {
      const count = Array.isArray(plans) ? plans.length : 0
      return {
        title: title || 'Pricing',
        subtitle: `Pricing Table · ${count} ${count === 1 ? 'plan' : 'plans'}`,
      }
    },
  },
})
