import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/sanity/client";
import { PAGE_QUERY } from "@/lib/sanity/queries";
import { RichText } from "./RichText";

/** A Sanity `page` document rendered as a simple article. */
export async function ContentPage({ slug }: { slug: string }) {
  const page = await sanityFetch(PAGE_QUERY, { slug }, ["page"]);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-[720px] px-6 pt-14 pb-20">
      <h1 className="text-[40px] leading-tight font-semibold tracking-[-0.02em]">{page.title}</h1>
      {page.body && (
        <div className="mt-8">
          <RichText value={page.body} />
        </div>
      )}
    </article>
  );
}
