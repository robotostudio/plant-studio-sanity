import {PresentationIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder block: a call to action styled like a 2003 slideshow slide,
 * complete with gradient background, WordArt heading and clip-art bullets.
 */
export const retroCta = defineType({
  name: 'retroCta',
  title: 'Retro Slide CTA',
  type: 'object',
  icon: PresentationIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
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
      description: 'Small text in the slide footer, next to the slide number.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Retro Slide CTA', subtitle: 'Retro Slide CTA'}
    },
  },
})
