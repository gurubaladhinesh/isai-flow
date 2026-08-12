import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/src/lib/blog";
import { SITE_NAME } from "@/src/lib/site";

export const metadata = {
  title: `Tamil Radio Guides & Tips | ${SITE_NAME} Blog`,
  description:
    "Guides for listening to Tamil FM radio online, streaming from abroad, and discovering Carnatic stations. Free tips from Isai Flow.",
};

export default function BlogIndexPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="flex flex-1 flex-col gap-8">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[rgba(18,26,23,0.55)] px-5 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
        <div className="relative max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-[var(--warm)]">
            <BookOpen className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.2em]">Blog</p>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl">
            Tamil radio guides & listening tips
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)] sm:text-base">
            Practical guides for streaming Tamil FM online, listening from abroad,
            and discovering Carnatic stations — all free on {SITE_NAME}.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col rounded-2xl border border-[var(--border)] bg-white/[0.02] p-5 transition hover:border-[var(--accent)]/40 hover:bg-white/[0.04]"
          >
            <time
              dateTime={post.publishedAt}
              className="text-xs text-[var(--muted)]"
            >
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              {post.readTime}
            </time>
            <h2 className="mt-2 font-display text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)]">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
              {post.description}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-bright)] transition group-hover:gap-2"
            >
              Read guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
