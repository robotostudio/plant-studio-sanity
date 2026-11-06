import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture, "slug": slug.current},
`

const personFields = /* groq */ `
  _id,
  firstName,
  lastName,
  "slug": slug.current,
  picture,
  bio,
  "postCount": count(*[_type == "post" && references(^._id) && defined(slug.current)]),
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const latestPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0...5] {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

// $q is "" for no search, or "term*" for a prefix match on title and excerpt.
const postsFilter = /* groq */ `
  _type == "post" && defined(slug.current) && ($q == "" || title match $q || excerpt match $q)
`

export const postsQuery = defineQuery(`
  *[${postsFilter}] | order(date desc, _updatedAt desc) [$start...$end] {
    ${postFields}
  }
`)

export const postsCountQuery = defineQuery(`count(*[${postsFilter}])`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const authorsQuery = defineQuery(`
  *[_type == "person" && defined(slug.current)] | order(firstName asc, lastName asc) {
    ${personFields}
  }
`)

export const authorSlugsQuery = defineQuery(`
  *[_type == "person" && defined(slug.current)] {"slug": slug.current}
`)

export const authorQuery = defineQuery(`
  *[_type == "person" && slug.current == $slug] [0] {
    ${personFields}
    "posts": *[_type == "post" && references(^._id) && defined(slug.current)] | order(date desc, _updatedAt desc) {
      ${postFields}
    }
  }
`)

export const faqQuery = defineQuery(`
  *[_type == "faq" && defined(question)] | order(_createdAt asc) {
    _id,
    question,
    answer
  }
`)
