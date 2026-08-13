import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getStationsByLanguage } from "@/src/lib/radio-api";
import { StationsPageClient } from "@/src/components/StationsPageClient";
import { LanguageNav } from "@/src/components/LanguageNav";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import {
  DEFAULT_LANGUAGE_SLUG,
  LIVE_LANGUAGES,
  getLiveLanguageBySlug,
} from "@/src/lib/languages";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";
import { buildBreadcrumbJsonLd } from "@/src/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ language: string }> | { language: string };
}

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

export async function generateStaticParams() {
  return LIVE_LANGUAGES.filter(
    (language) => language.slug !== DEFAULT_LANGUAGE_SLUG,
  ).map((language) => ({ language: language.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await resolveParams(params);
  const language = getLiveLanguageBySlug(resolved.language);

  if (!language) {
    return { title: `Language Not Found | ${SITE_NAME}` };
  }

  const title = `${language.englishName} Radio Online – Listen Live | ${SITE_NAME}`;
  const description = `Stream live ${language.englishName} FM radio stations for free on ${SITE_NAME}. ${language.description}`;
  const url = `${SITE_URL}/listen/${language.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: language.ogLocale,
      siteName: SITE_NAME,
    },
  };
}

export default async function LanguageListenPage({ params }: PageProps) {
  const resolved = await resolveParams(params);

  if (resolved.language === DEFAULT_LANGUAGE_SLUG) {
    redirect("/");
  }

  const language = getLiveLanguageBySlug(resolved.language);
  if (!language) {
    notFound();
  }

  const stations = await getStationsByLanguage(language.apiName, {
    offset: 0,
    limit: 48,
  }).catch((error: unknown) => {
    console.error("Failed to load stations", error);
    return [];
  });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: language.englishName },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb items={breadcrumbItems} />

      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[rgba(18,26,23,0.55)] px-5 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[var(--warm)]/15 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--warm)]">
            {language.nativeName}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl md:text-5xl">
            {language.headline}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)] sm:text-base">
            {language.description}
          </p>
          <div className="mt-6">
            <LanguageNav compact />
          </div>
        </div>
      </header>

      <section className="flex-1 pb-6">
        <h2 className="sr-only">Available {language.englishName} Radio Stations</h2>
        <Suspense
          fallback={
            <div className="text-sm text-[var(--muted)]">Loading stations…</div>
          }
        >
          <StationsPageClient
            initialStations={stations}
            initialOffset={stations.length}
            pageSize={48}
            language={language.apiName}
            languageLabel={language.englishName}
          />
        </Suspense>
      </section>
    </div>
  );
}
