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
      title: 'Rating (0.5 to 5, in half steps)',
      type: 'number',
      validation: (rule) =>
        rule
          .required()
          .min(0.5)
          .max(5)
          .custom((value) =>
            value === undefined || Number.isInteger(value * 2) ? true : 'Use half steps, like 3.5',
          ),
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
