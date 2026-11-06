import Link from "next/link";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";

import type { MoreStoriesQueryResult } from "@/sanity.types";

export type PostCardPost = MoreStoriesQueryResult[number];

export default function PostCard({ post }: { post: PostCardPost }) {
  const { title, slug, coverImage, excerpt, author } = post;
  return (
    <article>
      <Link href={`/posts/${slug}`} className="group mb-5 block">
        <CoverImage image={coverImage} priority={false} />
      </Link>
      <h3 className="text-balance mb-3 text-3xl leading-snug">
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h3>
      <div className="mb-4 text-lg">
        <DateComponent dateString={post.date} />
      </div>
      {excerpt && (
        <p className="text-pretty mb-4 text-lg leading-relaxed">{excerpt}</p>
      )}
      {author && (
        <Avatar name={author.name} picture={author.picture} slug={author.slug} />
      )}
    </article>
  );
}
