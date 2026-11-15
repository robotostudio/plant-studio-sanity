import {defineArrayMember, defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

/**
 * Page builder block that shows pricing plans side by side.
 */
export const plan = defineType({
  name: 'plan',
  title: 'Plan',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'string'}),
    defineField({
      name: 'period',
      title: 'Billing period',
      type: 'string',
      description: 'For example: per month',
    }),
    defineField({
      name: 'features',
      title: 'What is included',
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
})

export const pricingTable = defineType({
  name: 'pricingTable',
  title: 'Pricing Table',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [defineArrayMember({type: 'plan'})],
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
