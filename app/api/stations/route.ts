import { NextResponse } from "next/server";
import { getStationsByCountry } from "@/src/lib/radio-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const offsetParam = searchParams.get("offset");
  const limitParam = searchParams.get("limit");
  const countryParam = searchParams.get("country");
  const languageParam = searchParams.get("language");

  const offset = Number.isFinite(Number(offsetParam)) ? Number(offsetParam) : 0;
  const limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 32;
  const country = countryParam !== null ? countryParam : "IN"; // Use "IN" as default, but allow empty string
  const language = languageParam || undefined;

  try {
    const stations = await getStationsByCountry({ offset, limit, country, language });
    return NextResponse.json({ stations });
  } catch (error) {
    console.error("Failed to fetch stations page", error);
    return NextResponse.json(
      { error: "Failed to load stations" },
      { status: 500 },
    );
  }
}
