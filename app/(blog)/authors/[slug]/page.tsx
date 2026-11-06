import type { Metadata } from "next";
import { Image } from "next-sanity/image";
import { notFound } from "next/navigation";

import PostCard from "../../post-card";

import { sanityFetch } from "@/sanity/lib/fetch";
import { authorQuery, authorSlugsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return await sanityFetch({
    query: authorSlugsQuery,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await sanityFetch({
    query: authorQuery,
    params,
    stega: false,
  });
  return {
    title: author?.name,
    description: author?.bio ?? undefined,
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = await sanityFetch({ query: authorQuery, params });
  if (!author?._id) {
    return notFound();
  }
  const { name, picture, bio, posts } = author;

  return (
    <div className="container mx-auto px-5">
      <section className="mt-16 mb-16 flex flex-col items-start gap-8 md:flex-row md:items-center">
        {picture?.asset?._ref && (
          <Image
            alt={picture.alt || ""}
            className="h-40 w-40 rounded-full object-cover"
            height={160}
            width={160}
            priority
            src={
              urlForImage(picture)
                ?.height(320)
                .width(320)
                .fit("crop")
                .url() as string
            }
          />
        )}
        <div>
          <h1 className="text-balance mb-4 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
            {name}
          </h1>
          {bio && (
            <p className="text-pretty max-w-2xl text-xl leading-relaxed">
              {bio}
            </p>
          )}
        </div>
      </section>
      <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
        Posts by {name}
      </h2>
      {posts.length > 0 ? (
        <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mb-32 text-xl">No posts yet.</p>
      )}
    </div>
  );
}
