import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Customer reviews. Not shown on any page yet.
 */
export const review = defineType({
  name: 'review',
  title: 'Review',
  icon: StarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'reviewer',
      title: 'Reviewer name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Review',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {title: 'reviewer', subtitle: 'text'},
  },
})
