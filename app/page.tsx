import { getTamilStations } from "@/src/lib/radio-api";
import { StationsPageClient } from "@/src/components/StationsPageClient";
import Link from "next/link";
import { Star } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const stations = await getTamilStations({ offset: 0, limit: 32 }).catch(
    (error: unknown) => {
      console.error("Failed to load stations", error);
      return [];
    },
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
            Isai Flow – Tamil Radio
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Handpicked Tamil radio streams from around the world.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/gurubaladhinesh/isai-flow"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-violet-500/40 ring-1 ring-violet-300/70 transition hover:brightness-110 hover:shadow-violet-400/60"
          >
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              GitHub
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] leading-none">
              Vibe Coded. {" "}
              <Star
                className="h-3.5 w-3.5 text-yellow-300"
                fill="currentColor"
                aria-hidden="true"
              />{" "}
              the Repo if you like it
            </span>
          </Link>
        </div>
      </header>

      <section className="flex-1 pb-6">
        <h2 className="sr-only">Available Tamil Radio Stations</h2>
        <StationsPageClient
          initialStations={stations}
          initialOffset={stations.length}
          pageSize={32}
        />
      </section>
    </div>
  );
}

