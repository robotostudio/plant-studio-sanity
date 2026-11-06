import { Image } from "next-sanity/image";
import Link from "next/link";

import type { Author } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  name: string;
  picture: Exclude<Author["picture"], undefined> | null;
  slug?: string | null;
}

export default function Avatar({ name, picture, slug }: Props) {
  const content = (
    <>
      {picture?.asset?._ref ? (
        <div className="mr-4 h-12 w-12">
          <Image
            alt={picture?.alt || ""}
            className="h-full rounded-full object-cover"
            height={48}
            width={48}
            src={
              urlForImage(picture)
                ?.height(96)
                .width(96)
                .fit("crop")
                .url() as string
            }
          />
        </div>
      ) : (
        <div className="mr-1">By </div>
      )}
      <div className="text-pretty text-xl font-bold">{name}</div>
    </>
  );
  const className = "flex items-center text-xl";
  return slug ? (
    <Link href={`/authors/${slug}`} className={`${className} hover:underline`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
