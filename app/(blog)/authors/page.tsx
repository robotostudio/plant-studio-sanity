import type { Metadata } from "next";

import AuthorCard from "../author-card";

import { sanityFetch } from "@/sanity/lib/fetch";
import { authorsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Authors" };

export default async function AuthorsPage() {
  const authors = await sanityFetch({ query: authorsQuery });

  return (
    <div className="container mx-auto px-5">
      <h1 className="mt-16 mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        Authors
      </h1>
      {authors.length > 0 ? (
        <div className="mb-32 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <AuthorCard key={author._id} author={author} />
          ))}
        </div>
      ) : (
        <p className="mb-32 text-xl">No authors yet.</p>
      )}
    </div>
  );
}
