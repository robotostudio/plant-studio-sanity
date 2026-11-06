import { Image } from "next-sanity/image";
import Link from "next/link";

import type { AuthorsQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

export default function AuthorCard({
  author,
}: {
  author: AuthorsQueryResult[number];
}) {
  const { name, slug, picture, bio, postCount } = author;
  return (
    <article className="flex flex-col items-start">
      <Link href={`/authors/${slug}`} className="mb-5 block">
        {picture?.asset?._ref ? (
          <Image
            alt={picture.alt || ""}
            className="h-32 w-32 rounded-full object-cover"
            height={128}
            width={128}
            src={
              urlForImage(picture)
                ?.height(256)
                .width(256)
                .fit("crop")
                .url() as string
            }
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-200" />
        )}
      </Link>
      <h3 className="text-balance mb-2 text-3xl leading-snug">
        <Link href={`/authors/${slug}`} className="hover:underline">
          {name}
        </Link>
      </h3>
      <p className="mb-3 text-lg text-gray-600">
        {postCount} {postCount === 1 ? "post" : "posts"}
      </p>
      {bio && <p className="text-pretty text-lg leading-relaxed">{bio}</p>}
    </article>
  );
}
