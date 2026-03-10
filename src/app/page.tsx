import { getTamilStations } from "@/src/lib/radio-api";
import { StationGrid } from "@/src/components/StationGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stations = await getTamilStations().catch((error: unknown) => {
    console.error("Failed to load stations", error);
    return [];
  });

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
            Isai Flow
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Handpicked Tamil radio streams from around the world.
          </p>
        </div>
      </header>

      <section className="flex-1 overflow-auto pb-6">
        <StationGrid stations={stations} />
      </section>
    </div>
  );
}

