import {HelpCircleIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
    defineField({
      name: 'citations',
      title: 'Citations',
      description: 'Sources that back up this answer, shown below it.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'citation',
          title: 'Citation',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'url'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})
