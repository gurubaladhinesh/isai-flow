import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getAllTamilStations } from "@/src/lib/radio-api";
import { stationMatchesQuery } from "@/src/lib/station-search";

const getCachedAllTamilStations = unstable_cache(
  async () => getAllTamilStations(),
  ["tamil-stations-all"],
  { revalidate: 3600 },
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json({ stations: [] });
  }

  try {
    const stations = await getCachedAllTamilStations();
    const matches = stations
      .filter((station) => stationMatchesQuery(station, query))
      .sort((a, b) => b.clickcount - a.clickcount);

    return NextResponse.json(
      { stations: matches },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    console.error("Failed to search stations", error);
    return NextResponse.json(
      { error: "Failed to search stations" },
      { status: 500 },
    );
  }
}
