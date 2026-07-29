import { getTamilStations } from "@/src/lib/radio-api";
import { StationsPageClient } from "@/src/components/StationsPageClient";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const stations = await getTamilStations({ offset: 0, limit: 32 }).catch(
    (error: unknown) => {
      console.error("Failed to load stations", error);
      return [];
    },
  );

  return (
    <div className="flex h-full flex-1 flex-col gap-8">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[rgba(18,26,23,0.55)] px-5 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
        <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[var(--warm)]/15 blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="mb-4 hidden items-center gap-3 md:flex">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-deep)] text-2xl font-semibold text-[var(--accent-bright)] shadow-[0_0_32px_rgba(62,207,180,0.3)]"
              style={{ fontFamily: "var(--font-noto-tamil), sans-serif" }}
            >
              இ
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-[0.28em] text-[var(--warm)]">
                Isai Flow
              </p>
              <p className="text-xs text-[var(--muted)]">Tamil Internet Radio</p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-gradient sm:text-4xl md:text-5xl">
            Live Tamil radio, tuned for listening.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)] sm:text-base">
            Stream film hits, Carnatic, and FM stations from around the world —
            without the clutter.
          </p>
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
