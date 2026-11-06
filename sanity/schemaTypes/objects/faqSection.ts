import {HelpCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder block that shows a picked set of FAQ entries as an accordion.
 * Entries are references so the same answers can appear on several pages.
 */
export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'FAQ',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'FAQ',
        subtitle: `FAQ Section · ${count} ${count === 1 ? 'question' : 'questions'}`,
      }
    },
  },
})
