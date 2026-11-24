import {CommentIcon, StarIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {StarRatingInput} from '../../components/StarRatingInput'

/**
 * Page builder block that shows customer reviews in a sliding carousel.
 * Each review carries a star rating from 0.5 to 5 in half-star steps.
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
              description: 'Click a star: the left half gives a half star, the right half a whole star.',
              initialValue: 5,
              components: {input: StarRatingInput},
              validation: (rule) =>
                rule
                  .required()
                  .min(0.5)
                  .max(5)
                  .custom((value) =>
                    typeof value !== 'number' || Number.isInteger(value * 2)
                      ? true
                      : 'Use half-star steps, such as 3.5 or 4',
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
              title: 'Reviewer name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Reviewer role or company',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', quote: 'quote', author: 'author', rating: 'rating'},
            prepare({title, quote, author, rating}) {
              return {
                title: title || quote || 'Untitled review',
                subtitle: `${typeof rating === 'number' ? `${rating}★ · ` : ''}${author || ''}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
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
