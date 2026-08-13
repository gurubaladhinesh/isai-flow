import type { Station } from "@/src/lib/radio-api";

const cache = new Map<string, Station[]>();
const inflight = new Map<string, Promise<Station[]>>();

function cacheKey(offset: number, limit: number, language = "tamil"): string {
  return `${language}:${offset}:${limit}`;
}

export function seedStationPage(
  offset: number,
  limit: number,
  stations: Station[],
  language = "tamil",
): void {
  cache.set(cacheKey(offset, limit, language), stations);
}

export async function fetchStationPage(
  offset: number,
  limit: number,
  language = "tamil",
): Promise<Station[]> {
  const key = cacheKey(offset, limit, language);
  const cached = cache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      language,
    });
    const response = await fetch(`/api/stations?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to load stations");
    }
    const json = (await response.json()) as { stations: Station[] };
    const stations = json.stations ?? [];
    cache.set(key, stations);
    return stations;
  })();

  inflight.set(key, request);

  try {
    return await request;
  } finally {
    inflight.delete(key);
  }
}

export function prefetchStationPage(
  offset: number,
  limit: number,
  language = "tamil",
): void {
  const key = cacheKey(offset, limit, language);
  if (cache.has(key) || inflight.has(key)) return;
  void fetchStationPage(offset, limit, language).catch(() => {
    // Prefetch failures are non-fatal; scroll retry will handle it.
  });
}

export function mergeStations(
  existing: Station[],
  incoming: Station[],
): Station[] {
  if (incoming.length === 0) return existing;

  const map = new Map<string, Station>();
  for (const station of existing) {
    map.set(station.stationuuid, station);
  }
  for (const station of incoming) {
    if (!map.has(station.stationuuid)) {
      map.set(station.stationuuid, station);
    }
  }
  return Array.from(map.values());
}
