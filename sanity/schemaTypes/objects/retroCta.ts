import {PresentationIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder block: a call to action dressed up as a 2003-era presentation slide.
 */
export const retroCta = defineType({
  name: 'retroCta',
  title: 'Retro Slide CTA',
  type: 'object',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Slide title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet points',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'button',
      type: 'button',
    }),
    defineField({
      name: 'footer',
      title: 'Slide footer',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Untitled slide', subtitle: 'Retro Slide CTA'}
    },
  },
})
