import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {StarRatingInput} from '../components/StarRatingInput'

/**
 * Customer reviews, shown on the /reviews page.
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
      title: 'Rating',
      type: 'number',
      description: 'Click a star. Click the left half of a star for a half rating.',
      components: {input: StarRatingInput},
      validation: (rule) =>
        rule
          .required()
          .min(0.5)
          .max(5)
          .custom((value) =>
            value === undefined || Number.isInteger(value * 2)
              ? true
              : 'Ratings go up in half stars',
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
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'reviewer', rating: 'rating', subtitle: 'text'},
    prepare: ({title, rating, subtitle}) => ({
      title: `${title ?? 'Review'}${rating ? ` — ${rating}★` : ''}`,
      subtitle,
    }),
  },
})
