import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStationsByLocation } from "@/src/lib/radio-api";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StationGrid } from "@/src/components/StationGrid";
import { POPULAR_LOCATIONS, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { buildBreadcrumbJsonLd } from "@/src/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

function getLocation(slug: string) {
  return POPULAR_LOCATIONS.find((location) => location.slug === slug);
}

export async function generateStaticParams() {
  return POPULAR_LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolveParams(params);
  const location = getLocation(resolved.slug);

  if (!location) {
    return {
      title: `Location Not Found | ${SITE_NAME}`,
    };
  }

  const title = `Tamil Radio in ${location.label} – Listen Live | ${SITE_NAME}`;
  const description = `Stream live Tamil FM stations from ${location.label}. Free Tamil internet radio on ${SITE_NAME}.`;
  const url = `${SITE_URL}/location/${location.slug}`;

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

export default async function LocationPage({ params }: PageProps) {
  const resolved = await resolveParams(params);
  const location = getLocation(resolved.slug);

  if (!location) {
    notFound();
  }

  const stations = await getStationsByLocation(
    {
      ...("state" in location ? { state: location.state } : {}),
      ...("country" in location ? { country: location.country } : {}),
    },
    { limit: 48 },
  ).catch(() => []);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/location/india" },
    { label: location.label },
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
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--warm)]">Location</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brand-gradient sm:text-4xl">
          Tamil Radio in {location.label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Discover Tamil radio stations broadcasting from {location.label}.
          Listen to local FM channels, film music, and Carnatic streams for
          free on {SITE_NAME}.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">
          {stations.length > 0
            ? `${stations.length} stations in ${location.label}`
            : `No stations found in ${location.label}`}
        </h2>
        <StationGrid stations={stations} />
      </section>
    </div>
  );
}
