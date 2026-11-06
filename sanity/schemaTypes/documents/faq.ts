import {HelpCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * FAQ entries rendered on the home page below the latest posts.
 */
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  icon: HelpCircleIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})
