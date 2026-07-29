export interface Station {
  stationuuid: string;
  name: string;
  favicon: string;
  url: string;
  url_resolved: string;
  country: string;
  state: string;
  language: string;
  tags: string;
  bitrate: number;
  clickcount: number;
  ssl_error: number;
}

const RADIO_BROWSER_ENDPOINT =
  "https://de1.api.radio-browser.info/json/stations/search";

interface FetchStationsOptions {
  signal?: AbortSignal;
  offset?: number;
  limit?: number;
}

export async function getTamilStations(
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);

  const limit = options.limit ?? 32;
  const offset = options.offset ?? 0;

  url.searchParams.set("language", "tamil");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "isai-flow/1.0 (https://isaiflow.in)",
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

  const data = (await response.json()) as Station[];

  // Allow both HTTPS and HTTP streams and rely on Radio Browser's
  // own `hidebroken=true` filter. We only de-duplicate by UUID.
  const uniqueById = new Map<string, Station>();
  for (const station of data) {
    if (!uniqueById.has(station.stationuuid)) {
      uniqueById.set(station.stationuuid, station);
    }
  }

  return Array.from(uniqueById.values());
}

export async function getAllTamilStations(): Promise<Station[]> {
  const allStations: Station[] = [];
  const pageSize = 100;
  let offset = 0;

  while (true) {
    const batch = await getTamilStations({ offset, limit: pageSize });
    if (batch.length === 0) {
      break;
    }

    allStations.push(...batch);
    offset += batch.length;

    if (batch.length < pageSize) {
      break;
    }
  }

  return allStations;
}

export async function getStationsByTag(
  tag: string,
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);
  const limit = options.limit ?? 32;
  const offset = options.offset ?? 0;

  url.searchParams.set("tag", tag);
  url.searchParams.set("language", "tamil");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "isai-flow/1.0 (https://isaiflow.in)",
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stations by tag: ${response.statusText}`);
  }

  return (await response.json()) as Station[];
}

export async function getStationsByLocation(
  filters: { state?: string; country?: string },
  options: FetchStationsOptions = {},
): Promise<Station[]> {
  const url = new URL(RADIO_BROWSER_ENDPOINT);
  const limit = options.limit ?? 32;
  const offset = options.offset ?? 0;

  if (filters.state) {
    url.searchParams.set("state", filters.state);
  }
  if (filters.country) {
    url.searchParams.set("country", filters.country);
  }

  url.searchParams.set("language", "tamil");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("order", "clickcount");
  url.searchParams.set("hidebroken", "true");
  url.searchParams.set("reverse", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "isai-flow/1.0 (https://isaiflow.in)",
    },
    signal: options.signal,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stations by location: ${response.statusText}`,
    );
  }

  return (await response.json()) as Station[];
}

export async function getRelatedStations(
  station: Station,
  limit = 6,
): Promise<Station[]> {
  const tags = station.tags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tags && tags.length > 0) {
    const related = await getStationsByTag(tags[0], { limit: limit + 1 }).catch(
      () => [] as Station[],
    );
    const filtered = related.filter(
      (item) => item.stationuuid !== station.stationuuid,
    );
    if (filtered.length > 0) {
      return filtered.slice(0, limit);
    }
  }

  if (station.country) {
    const related = await getStationsByLocation(
      { country: station.country },
      { limit: limit + 1 },
    ).catch(() => [] as Station[]);
    return related
      .filter((item) => item.stationuuid !== station.stationuuid)
      .slice(0, limit);
  }

  return [];
}

/**
 * Fetches a single station by its UUID
 */
export async function getStationById(uuid: string): Promise<Station | null> {
  const url = `https://de1.api.radio-browser.info/json/stations/byuuid/${uuid}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "isai-flow/1.0 (https://isaiflow.in)",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      console.error(`Failed to fetch station: ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as Station[];

    if (data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error("Error fetching station:", error);
    return null;
  }
}
