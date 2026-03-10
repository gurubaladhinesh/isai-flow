import { NextResponse } from "next/server";
import { getTamilStations } from "@/src/lib/radio-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const offsetParam = searchParams.get("offset");
  const limitParam = searchParams.get("limit");

  const offset = Number.isFinite(Number(offsetParam)) ? Number(offsetParam) : 0;
  const limit = Number.isFinite(Number(limitParam)) ? Number(limitParam) : 32;

  try {
    const stations = await getTamilStations({ offset, limit });
    return NextResponse.json({ stations });
  } catch (error) {
    console.error("Failed to fetch stations page", error);
    return NextResponse.json(
      { error: "Failed to load stations" },
      { status: 500 },
    );
  }
}

