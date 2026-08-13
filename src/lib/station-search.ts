import type { Station } from "@/src/lib/radio-api";

export function stationMatchesQuery(station: Station, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const haystack = [
    station.name,
    station.country,
    station.state,
    station.tags,
    station.language,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}
