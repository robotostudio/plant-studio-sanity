import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), "slug": slug.current, picture},
`;

const authorFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  picture,
  bio,
  "postCount": count(*[_type == "post" && references(^._id) && defined(slug.current)]),
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

// $q is "" for no search, or "term*" for a prefix match on title and excerpt.
const postsFilter = /* groq */ `
  _type == "post" && defined(slug.current) && ($q == "" || title match $q || excerpt match $q)
`;

export const postsQuery = defineQuery(`
  *[${postsFilter}] | order(date desc, _updatedAt desc) [$start...$end] {
    ${postFields}
  }
`);

export const postsCountQuery = defineQuery(`count(*[${postsFilter}])`);

export const authorsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)] | order(name asc) {
    ${authorFields}
  }
`);

export const authorSlugsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)] { "slug": slug.current }
`);

export const authorQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug] [0] {
    ${authorFields}
    "posts": *[_type == "post" && references(^._id) && defined(slug.current)] | order(date desc, _updatedAt desc) {
      ${postFields}
    }
  }
`);

export const faqQuery = defineQuery(`
  *[_type == "faq" && defined(question)] | order(_createdAt asc) {
    _id,
    question,
    answer
  }
`);
