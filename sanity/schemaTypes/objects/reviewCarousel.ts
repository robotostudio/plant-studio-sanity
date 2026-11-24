import {CommentIcon, StarIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {StarRatingInput} from '../../components/StarRatingInput'

/**
 * Page builder block: a carousel of customer reviews, each with an
 * Amazon-style star rating from 0.5 to 5 in half-star steps.
 */
export const reviewCarousel = defineType({
  name: 'reviewCarousel',
  title: 'Review Carousel',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'review',
          title: 'Review',
          type: 'object',
          icon: StarIcon,
          fields: [
            defineField({
              name: 'rating',
              title: 'Rating',
              type: 'number',
              description: 'Click the left half of a star for a half star.',
              components: {input: StarRatingInput},
              initialValue: 5,
              validation: (rule) =>
                rule
                  .required()
                  .min(0.5)
                  .max(5)
                  .custom((value) =>
                    typeof value !== 'number' || Number.isInteger(value * 2)
                      ? true
                      : 'Use half-star steps, like 3.5 or 4',
                  ),
            }),
            defineField({
              name: 'title',
              title: 'Review title',
              type: 'string',
            }),
            defineField({
              name: 'quote',
              title: 'Review',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Reviewer',
              type: 'string',
            }),
            defineField({
              name: 'role',
              title: 'Reviewer role',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', quote: 'quote', author: 'author', rating: 'rating'},
            prepare({title, quote, author, rating}) {
              const stars = typeof rating === 'number' ? `${rating}★` : 'No rating'
              return {
                title: title || quote || 'Untitled review',
                subtitle: [stars, author].filter(Boolean).join(' · '),
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', reviews: 'reviews'},
    prepare({title, reviews}) {
      const count = Array.isArray(reviews) ? reviews.length : 0
      return {
        title: title || 'Reviews',
        subtitle: `Review Carousel · ${count} ${count === 1 ? 'review' : 'reviews'}`,
      }
    },
  },
})
