import type { Station } from "@/src/lib/radio-api";

const cache = new Map<string, Station[]>();
const inflight = new Map<string, Promise<Station[]>>();

function cacheKey(offset: number, limit: number): string {
  return `${offset}:${limit}`;
}

export function seedStationPage(
  offset: number,
  limit: number,
  stations: Station[],
): void {
  cache.set(cacheKey(offset, limit), stations);
}

export async function fetchStationPage(
  offset: number,
  limit: number,
): Promise<Station[]> {
  const key = cacheKey(offset, limit);
  const cached = cache.get(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
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

export async function searchStations(
  query: string,
  signal?: AbortSignal,
): Promise<Station[]> {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/stations/search?${params.toString()}`, {
    signal,
  });
  if (!response.ok) {
    throw new Error("Failed to search stations");
  }
  const json = (await response.json()) as { stations: Station[] };
  return json.stations ?? [];
}

export function prefetchStationPage(offset: number, limit: number): void {
  const key = cacheKey(offset, limit);
  if (cache.has(key) || inflight.has(key)) return;
  void fetchStationPage(offset, limit).catch(() => {
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
