import { getStationById } from "@/src/lib/radio-api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlayCircle, Radio, MapPin, Signal, Headphones } from "lucide-react";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { createSlug } from "@/src/lib/slug";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const station = await getStationById(params.id);

  if (!station) {
    return {
      title: "Station Not Found | Isai Flow",
      description: "The requested Tamil radio station could not be found.",
    };
  }

  const baseTitle = station.name || "Tamil Radio Station";
  const location = station.state ? `${station.state}, ${station.country}` : station.country;
  const bitrateInfo = station.bitrate ? `${station.bitrate} kbps` : "High quality";

  return {
    title: `${baseTitle} - Listen Live | Isai Flow Tamil Radio`,
    description: `Listen to ${baseTitle} live on Isai Flow. ${location}. ${bitrateInfo} streaming. ${station.tags ? station.tags : 'Tamil music and entertainment'}.`,
    keywords: [station.name, "Tamil Radio", station.country, station.language, "Live FM", ...(station.tags ? station.tags.split(",") : [])],
    openGraph: {
      title: `${baseTitle} - Listen Live on Isai Flow`,
      description: `Stream ${baseTitle} live. ${location}. ${bitrateInfo} audio quality.`,
      type: "website",
      url: `https://isaiflow.in/station/${params.id}-${createSlug(station.name)}`,
      images: station.favicon ? [{ url: station.favicon }] : [],
      locale: "ta_IN",
      siteName: "Isai Flow",
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} - Tamil Radio Live`,
      description: `Listen to ${baseTitle} streaming on Isai Flow`,
    },
    alternates: {
      canonical: `https://isaiflow.in/station/${params.id}-${createSlug(station.name)}`,
    },
  };
}

export default async function StationPage({ params }: PageProps) {
  const station = await getStationById(params.id);

  if (!station) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stations", href: "/" },
    { label: station.name },
  ];

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <Breadcrumb items={breadcrumbItems} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative aspect-square w-24 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black sm:w-32">
            {station.favicon ? (
              <Image
                src={station.favicon}
                alt={station.name}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
                <Radio className="h-8 w-8 text-violet-400" />
              </div>
            )}
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              {station.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              {station.country && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-violet-400" />
                  <span>{station.state ? `${station.state}, ${station.country}` : station.country}</span>
                </div>
              )}

              {station.bitrate > 0 && (
                <div className="flex items-center gap-1">
                  <Signal className="h-4 w-4 text-fuchsia-400" />
                  <span>{station.bitrate} kbps</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Headphones className="h-4 w-4 text-emerald-400" />
                <span>{station.clickcount} listeners</span>
              </div>
            </div>

            {station.tags && (
              <div className="mt-3 flex flex-wrap gap-2">
                {station.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-violet-900/30 px-2 py-1 text-xs text-violet-200"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <StationPlayButton station={station} />
      </header>

      <section className="mt-4 border-t border-white/10 pt-6">
        <h2 className="text-lg font-semibold text-white">About this Station</h2>
        <p className="mt-2 text-sm text-zinc-400">
          {station.name} is a Tamil radio station broadcasting from {station.country}.
          Enjoy high-quality Tamil music, news, and entertainment with {station.bitrate} kbps streaming.
        </p>
      </section>
    </div>
  );
}

function StationPlayButton({ station }: { station: any }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 ring-1 ring-violet-300/70 transition hover:brightness-110 hover:shadow-violet-400/50"
    >
      <PlayCircle className="h-5 w-5" />
      <span>Play Station</span>
    </button>
  );
}