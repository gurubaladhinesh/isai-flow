import {
  getRelatedStations,
  getStationById,
  getTamilStations,
} from "@/src/lib/radio-api";
import { notFound } from "next/navigation";
import { MapPin, Signal, Headphones } from "lucide-react";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StationPlayControls } from "@/src/components/StationPlayControls";
import { StationArtwork } from "@/src/components/StationArtwork";
import { StationGrid } from "@/src/components/StationGrid";
import {
  createSlug,
  extractStationId,
  getStationUrl,
} from "@/src/lib/slug";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";
import {
  buildBreadcrumbJsonLd,
  buildStationJsonLd,
  getStationOgImage,
} from "@/src/lib/seo";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

async function resolveParams(params: PageProps["params"]) {
  return await Promise.resolve(params);
}

export async function generateStaticParams() {
  try {
    const stations = await getTamilStations({ limit: 100 });
    return stations.map((station) => ({
      id: `${station.stationuuid}-${createSlug(station.name)}`,
    }));
  } catch (error) {
    console.error("Failed to generate static station params", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const resolved = await resolveParams(params);
  const stationId = extractStationId(resolved.id);
  const station = await getStationById(stationId);

  if (!station) {
    return {
      title: `Station Not Found | ${SITE_NAME}`,
      description: "The requested Tamil radio station could not be found.",
    };
  }

  const baseTitle = station.name || "Tamil Radio Station";
  const location = station.state
    ? `${station.state}, ${station.country}`
    : station.country;
  const bitrateInfo = station.bitrate ? `${station.bitrate} kbps` : "High quality";
  const path = getStationUrl(station);
  const url = `${SITE_URL}${path}`;
  const ogImage = getStationOgImage(station);

  return {
    title: `${baseTitle} - Listen Live | ${SITE_NAME} Tamil Radio`,
    description: `Listen to ${baseTitle} live on ${SITE_NAME}. ${location}. ${bitrateInfo} streaming. ${station.tags ? station.tags : "Tamil music and entertainment"}.`,
    openGraph: {
      title: `${baseTitle} - Listen Live on ${SITE_NAME}`,
      description: `Stream ${baseTitle} live. ${location}. ${bitrateInfo} audio quality.`,
      type: "website",
      url,
      images: [{ url: ogImage, alt: baseTitle }],
      locale: "ta_IN",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} - Tamil Radio Live`,
      description: `Listen to ${baseTitle} streaming on ${SITE_NAME}`,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function StationPage({ params }: PageProps) {
  const resolved = await resolveParams(params);
  const stationId = extractStationId(resolved.id);
  const station = await getStationById(stationId);

  if (!station) {
    notFound();
  }

  const tags = station.tags
    ? station.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const locationLabel = station.state
    ? `${station.state}, ${station.country}`
    : station.country || "Worldwide";

  const relatedStations = await getRelatedStations(station).catch(() => []);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stations", href: "/" },
    { label: station.name },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const stationJsonLd = buildStationJsonLd(station);

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stationJsonLd) }}
      />
      <Breadcrumb items={breadcrumbItems} />

      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[rgba(18,26,23,0.65)]">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-30" />
        <div className="relative flex flex-col gap-6 p-5 sm:flex-row sm:items-end sm:p-8">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl bg-[#15201c] shadow-2xl sm:mx-0 sm:w-56 sm:max-w-none md:w-64">
            <StationArtwork
              src={station.favicon}
              alt={station.name}
              sizes="280px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--warm)]">
                Live station
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl">
                {station.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              {station.country && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[var(--accent-bright)]" />
                  <span>{locationLabel}</span>
                </div>
              )}

              {station.bitrate > 0 && (
                <div className="flex items-center gap-1.5">
                  <Signal className="h-4 w-4 text-[var(--warm)]" />
                  <span>{station.bitrate} kbps</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-[var(--accent-bright)]" />
                <span>{station.clickcount.toLocaleString()} listeners</span>
              </div>
            </div>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] bg-white/[0.04] px-2.5 py-1 text-xs text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <StationPlayControls station={station} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">
          About this station
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Language
            </dt>
            <dd className="mt-1 text-sm text-[var(--text)]">
              {station.language || "Tamil"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Location
            </dt>
            <dd className="mt-1 text-sm text-[var(--text)]">{locationLabel}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Audio quality
            </dt>
            <dd className="mt-1 text-sm text-[var(--text)]">
              {station.bitrate > 0
                ? `${station.bitrate} kbps stream`
                : "Variable bitrate"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
              Tags
            </dt>
            <dd className="mt-1 text-sm text-[var(--text)]">
              {tags.length > 0 ? tags.join(" · ") : "Tamil radio"}
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
          Tune into {station.name} on {SITE_NAME} for live Tamil programming
          from {locationLabel}.
          {tags.length > 0
            ? ` This station is known for ${tags.slice(0, 3).join(", ")}.`
            : ""}{" "}
          Press Play to start streaming in the persistent player, or save it to
          your favorites for quick access later.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          {SITE_NAME} streams {station.name} directly in your browser — no app
          download required. Works on mobile, tablet, and desktop with free,
          high-quality Tamil radio.
        </p>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">
          Frequently asked questions
        </h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm font-medium text-[var(--text)]">
              Is {station.name} free to listen?
            </dt>
            <dd className="mt-1 text-sm text-[var(--muted)]">
              Yes. {SITE_NAME} provides free access to {station.name} and all
              Tamil radio stations in our catalogue.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--text)]">
              Can I listen on my phone?
            </dt>
            <dd className="mt-1 text-sm text-[var(--muted)]">
              Yes. Open this page on any mobile browser and tap Play to stream{" "}
              {station.name} live.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-[var(--text)]">
              What audio quality does this stream offer?
            </dt>
            <dd className="mt-1 text-sm text-[var(--muted)]">
              {station.bitrate > 0
                ? `${station.name} streams at ${station.bitrate} kbps for clear Tamil audio.`
                : `${station.name} offers variable bitrate streaming depending on your connection.`}
            </dd>
          </div>
        </dl>
      </section>

      {relatedStations.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Related stations</h2>
            <p className="text-sm text-[var(--muted)]">
              More Tamil radio stations you might enjoy.
            </p>
          </div>
          <StationGrid stations={relatedStations} />
        </section>
      ) : null}
    </div>
  );
}
