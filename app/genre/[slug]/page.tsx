import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStationsByTag } from "@/src/lib/radio-api";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StationGrid } from "@/src/components/StationGrid";
import { POPULAR_GENRES, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { buildBreadcrumbJsonLd } from "@/src/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

function getGenre(slug: string) {
  return POPULAR_GENRES.find((genre) => genre.slug === slug);
}

export async function generateStaticParams() {
  return POPULAR_GENRES.map((genre) => ({ slug: genre.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolveParams(params);
  const genre = getGenre(resolved.slug);

  if (!genre) {
    return {
      title: `Genre Not Found | ${SITE_NAME}`,
    };
  }

  const title = `${genre.label} Tamil Radio – Listen Live | ${SITE_NAME}`;
  const description = `Stream live ${genre.label.toLowerCase()} Tamil radio stations online. Free, high-quality Tamil internet radio on ${SITE_NAME}.`;
  const url = `${SITE_URL}/genre/${genre.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "ta_IN",
      siteName: SITE_NAME,
    },
  };
}

export default async function GenrePage({ params }: PageProps) {
  const resolved = await resolveParams(params);
  const genre = getGenre(resolved.slug);

  if (!genre) {
    notFound();
  }

  const stations = await getStationsByTag(genre.tag, { limit: 48 }).catch(() => []);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Genres", href: "/genre/carnatic" },
    { label: genre.label },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb items={breadcrumbItems} />

      <header className="rounded-3xl border border-[var(--border)] bg-[rgba(18,26,23,0.55)] px-5 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--warm)]">Genre</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brand-gradient sm:text-4xl">
          {genre.label} Tamil Radio
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Listen to live {genre.label.toLowerCase()} Tamil radio stations from
          around the world. Browse curated streams and start listening instantly
          in the {SITE_NAME} player.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          {stations.length > 0
            ? `${stations.length} ${genre.label} stations`
            : `No ${genre.label} stations found`}
        </h2>
        <StationGrid stations={stations} />
      </section>
    </div>
  );
}
