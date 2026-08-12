import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { getBlogPost, getAllBlogSlugs } from "@/src/lib/blog";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";
import { buildArticleJsonLd } from "@/src/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const post = getBlogPost(slug);

  if (!post) {
    return { title: `Post Not Found | ${SITE_NAME}` };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.publishedAt,
      locale: "en_IN",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  const articleJsonLd = buildArticleJsonLd(post);

  return (
    <article className="flex flex-1 flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumb items={breadcrumbItems} />

      <header className="max-w-3xl">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--accent-bright)]"
        >
          <ArrowLeft className="h-4 w-4" />
          All guides
        </Link>
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
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
          {post.description}
        </p>
      </header>

      <div className="max-w-3xl space-y-8">
        {post.sections.map((section, index) => (
          <section key={index}>
            {section.heading ? (
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">
                {section.heading}
              </h2>
            ) : null}
            <div className={section.heading ? "mt-3 space-y-3" : "space-y-3"}>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-sm leading-relaxed text-[var(--muted)] sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="max-w-3xl rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">
          Start listening now
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Browse hundreds of live Tamil FM stations — free, no sign-up required.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[#04110e] transition hover:bg-[var(--accent-bright)]"
        >
          Open {SITE_NAME}
        </Link>
      </div>
    </article>
  );
}
