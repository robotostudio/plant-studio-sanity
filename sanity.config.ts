/**
 * Sanity Studio config. The Studio is embedded in Next.js at /studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */
import {assist} from '@sanity/assist'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {
  defineDocuments,
  defineLocations,
  presentationTool,
  type DocumentLocation,
} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'

import {apiVersion, dataset, projectId, studioUrl} from './sanity/lib/api'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const homeLocation = {title: 'Home', href: '/'} satisfies DocumentLocation

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'person':
      return slug ? `/authors/${slug}` : undefined
    default:
      return undefined
  }
}

export default defineConfig({
  name: 'default',
  title: 'Plant Studio Sanity',
  basePath: studioUrl,
  projectId,
  dataset,
  plugins: [
    // Structure first so /studio opens on the document lists, not Presentation.
    structureTool({structure}),
    presentationTool({
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
      resolve: {
        mainDocuments: defineDocuments([
          {route: '/', filter: `_type == "settings" && _id == "siteSettings"`},
          {route: '/:slug', filter: `_type == "page" && slug.current == $slug || _id == $slug`},
          {route: '/posts/:slug', filter: `_type == "post" && slug.current == $slug || _id == $slug`},
          {route: '/authors/:slug', filter: `_type == "person" && slug.current == $slug || _id == $slug`},
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [{title: doc?.name || 'Untitled', href: resolveHref('page', doc?.slug)!}],
            }),
          }),
          post: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Untitled', href: resolveHref('post', doc?.slug)!},
                homeLocation,
              ],
            }),
          }),
          person: defineLocations({
            select: {firstName: 'firstName', lastName: 'lastName', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {
                  title: [doc?.firstName, doc?.lastName].filter(Boolean).join(' ') || 'Author',
                  href: resolveHref('person', doc?.slug)!,
                },
                {title: 'Authors', href: '/authors'},
              ],
            }),
          }),
          faq: defineLocations({
            locations: [homeLocation],
            message: 'FAQ entries show on the home page',
            tone: 'positive',
          }),
        },
      },
    }),
    unsplashImageAsset(),
    assist(),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  schema: {types: schemaTypes},
})
