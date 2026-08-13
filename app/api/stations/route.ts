import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getStationsByLanguage } from "@/src/lib/radio-api";
import { isLiveLanguageSlug } from "@/src/lib/languages";

const getCachedStations = unstable_cache(
  async (language: string, offset: number, limit: number) =>
    getStationsByLanguage(language, { offset, limit }),
  ["stations-by-language-page"],
  { revalidate: 3600 },
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const offsetParam = searchParams.get("offset");
  const limitParam = searchParams.get("limit");
  const languageParam = searchParams.get("language")?.trim().toLowerCase();
  const language =
    languageParam && isLiveLanguageSlug(languageParam)
      ? languageParam
      : "tamil";

  const offset = Number.isFinite(Number(offsetParam)) ? Number(offsetParam) : 0;
  const limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 48;

  try {
    const stations = await getCachedStations(language, offset, limit);
    return NextResponse.json(
      { stations },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch stations page", error);
    return NextResponse.json(
      { error: "Failed to load stations" },
      { status: 500 },
    );
  }
}
