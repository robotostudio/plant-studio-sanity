import type { Metadata } from "next";
import Link from "next/link";

import PostCard from "../post-card";

import { sanityFetch } from "@/sanity/lib/fetch";
import { postsCountQuery, postsQuery } from "@/sanity/lib/queries";

const PAGE_SIZE = 9;

type Props = {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

export const metadata: Metadata = { title: "Posts" };

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PostsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const term = (first(sp.q) ?? "").trim();
  // GROQ match works on words; the trailing * makes it a prefix match.
  const q = term ? `${term}*` : "";
  const count = (await sanityFetch({ query: postsCountQuery, params: { q } })) ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const requested = Math.max(1, Math.floor(Number(first(sp.page))) || 1);
  const page = Math.min(requested, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const posts = await sanityFetch({
    query: postsQuery,
    params: { q, start, end: start + PAGE_SIZE },
  });
  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/posts?${query}` : "/posts";
  };

  return (
    <div className="container mx-auto px-5">
      <h1 className="mt-16 mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        All posts
      </h1>
      <form
        action="/posts"
        method="get"
        role="search"
        className="mb-8 flex max-w-xl gap-3"
      >
        <label htmlFor="q" className="sr-only">
          Search posts
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={term}
          placeholder="Search posts"
          className="w-full border border-black px-4 py-3 text-lg"
        />
        <button
          type="submit"
          className="border border-black bg-black px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black"
        >
          Search
        </button>
      </form>
      <p className="mb-12 text-lg" aria-live="polite">
        {term
          ? `${count} ${count === 1 ? "result" : "results"} for "${term}"`
          : `${count} ${count === 1 ? "post" : "posts"}`}
      </p>
      {posts.length > 0 ? (
        <div className="mb-16 grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mb-16 text-xl">
          No posts found.{" "}
          {term && (
            <Link href="/posts" className="underline">
              Clear search
            </Link>
          )}
        </p>
      )}
      {pageCount > 1 && (
        <nav
          aria-label="Pagination"
          className="mb-32 flex items-center justify-between text-lg"
        >
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="font-bold hover:underline">
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {page} of {pageCount}
          </span>
          {page < pageCount ? (
            <Link href={pageHref(page + 1)} className="font-bold hover:underline">
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
